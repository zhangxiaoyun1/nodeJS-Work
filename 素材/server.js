const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");
const querystring = require("querystring");

var userList = [
    { username: "admin", pwd: "admin" }
];

http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true);
    var name = urlObj.pathname;
    if (name === "/list") {
        showList(res);
    } else if (name === "/css/base.css") {
        fs.readFile('./css/base.css', function (err, data) {
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(data);
        })
    } else if (name === "/css/style.css") {
        fs.readFile('./css/style.css', function (err, data) {
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(data);
        })
    } else if (name === "/css/new.css") {
        fs.readFile('./css/new.css', function (err, data) {
            res.writeHead(200, { "Content-Type": "text/css" });
            res.end(data);
        })
    } else if (name === "/js/baiduTemplate.js") {
        fs.readFile('./js/baiduTemplate.js', function (err, data) {
            res.writeHead(200, { "Content-Type": "text/js" });
            res.end(data);
        })
    } else if (name === "/detail") {
        fs.readFile('./chapter.html', function (err, data) {
            res.writeHeader(200, { "Content-Type": "text/html" });
            res.end(data);
        })
    } else if (name === "/getDetail") {
        fs.readFile('./add.json', function (err, data) {
            res.end(data.toString());
        })
    } else if (name === "/login") {
        fs.readFile('./login.html', function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        })
    } else if (name === "/pf") {
        var dataStr = "";
        req.on('data', function (chunk) {
            dataStr += chunk;
        });
        req.on("end", function () {
            var dataObj = querystring.parse(dataStr);
            var i = 0;
            for (; i < userList.length; i++) {
                if (dataObj.username == userList[i].username && dataObj.pwd == userList[i].pwd) {
                    res.end(JSON.stringify(1));
                    break;
                } else if (i == userList.length - 1) {
                    res.end(JSON.stringify(0));
                }
            }
        });
    } else if (name === "/login_bg.jpg") {
        fs.readFile('./login_bg.jpg', function (err, data) {
            res.writeHead(200, { "Content-Type": "image/jpeg" });
            res.end(data);
        })
    } else if (name === "/listmanager") {
        fs.readFile('./list.html', function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        })
    } else if (name === "/del") {
        var datastr = '';
        req.on('data', function (chunk) {
            datastr += chunk;
        })
        req.on('end', function () {
            fs.readFile('./add.json', function (err, data) {
                var dataObj = querystring.parse(datastr);
                var newObj = JSON.parse(data);
                newObj.splice(parseInt(dataObj.id),1);
                for(var i=parseInt(dataObj.id);i<newObj.length;i++){
                    newObj[i].chapterId=i+1;
                }
                fs.writeFileSync('./add.json', JSON.stringify(newObj));
                res.end();
            })
        })
    } else if (name === "/addChapter") {
        fs.readFile('./addChapter.html', function (err, data) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(data);
        })
    } else if (name === "/add") {
        var dataStr = "";
        var obj = {};
        req.on('data', function (chunk) {
            dataStr += chunk;
        });
        req.on("end", function () {
            fs.readFile('./add.json', function (err, data) {
                var dataObj = querystring.parse(dataStr);
                var newObj = JSON.parse(data);
                obj.chapterId = newObj.length + 1;
                obj.chapterName = dataObj.title;
                obj.chapterContent = dataObj.content;
                obj.imgPath = '';
                obj.chapterDes = '';
                obj.publishTimer = '';
                obj.author = '';
                obj.views = '150';
                newObj.push(obj);
                fs.writeFileSync('./add.json', JSON.stringify(newObj));
                res.end();
            })

        });
    } else if (name === "/get") {
        fs.readFile('./add.json', function (err, data) {
            res.end(data.toString());
        })
    } else if (name.indexOf("images") > 0) {
        var filename = name.split('/');
        list = fs.readdirSync(path.join(__dirname, '/images'));
        for (var i = 0; i < list.length; ++i) {
            if (list[i] == filename[2]) {
                var imgPath = path.join(__dirname, '/images/', list[i]);
                if (!fs.statSync(imgPath).isFile(imgPath)) {
                    imgPath = path.join(__dirname, '/images/', filename[2], filename[3]);
                }
                fs.readFile(imgPath, (err, data) => {
                    if (err) {
                        console.log(err);
                    } else {
                        if (filename[2].indexOf('png') > 0 || filename[2].indexOf('PNG') > 0) {
                            res.writeHead(200, { "Content-Type": "image/png" })
                        } else if (filename[2].indexOf('jpg') > 0 || filename[2].indexOf('JPG') > 0 || filename[2].indexOf('jpeg') > 0 || filename[1].indexOf('JPEG') > 0) {
                            res.writeHead(200, { "Content-Type": "image/jpeg" });
                        } else if (filename[2].indexOf('gif') > 0 || filename[2].indexOf('GIF') > 0) {
                            res.writeHead(200, { "Content-Type": "image/gif" });
                        }
                        res.end(data);
                    }
                })
            }

        }
    }
}).listen(8083, 'localhost');
function showList(res) {
    fs.readFile('./chapterList.html', function (err, data) {
        res.writeHead(200, { "Content-Type": "text/html" });
        res.end(data);
    })
}
