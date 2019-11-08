var express = require('express');
var router = express.Router();
var fs = require('fs');
var path=require('path');
/* GET home page. */

router.get('/', function (req, res, next) {
  res.render('login');
});
router.post('/pf', function (req, res, next) {
    fs.readFile(path.join(__dirname,'./data.json'), function (err, data) {
      var newData = JSON.parse(data).users;
      var i = 0;
      for (; i < newData.length; i++) {
        if (req.body.username == newData[i].username && req.body.pwd == newData[i].password) {
          res.end(JSON.stringify(1));
          break;
        } else if (i == newData.length - 1) {
          res.end(JSON.stringify(0));
        }
      }
    })
});
router.get('/list', function (req, res, next) {
  res.render('list');
});
router.get('/get', function (req, res, next) {
  fs.readFile(path.join(__dirname,'./data.json'), function (err, data) {
    res.end(data.toString());
  })
})
module.exports = router;
