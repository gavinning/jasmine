var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.redirect('/static/sage');
  // res.render('index', { title: 'Express' });
  // req.hostname === '127.0.0.1' ?
  //     res.redirect('/static/sage'):
  //     res.render('index', { title: 'Express' });
});


module.exports = router;
