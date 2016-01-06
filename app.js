var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var multer = require('multer');
var config = require('vpm-config');
var sup = require('./lib/app');
var routes = require('./routes/index');
var users = require('./routes/users');
var app = express();

// 缓存System路径
app.__dirname = __dirname;
// 加密算法
app.crypto = require('./lib/crypto');
app.app = {};
root.app = app;
root.system = app;


// 模板路径设置
app.set('views', path.join(__dirname, 'views'));
// 模板引擎设置
app.set('view engine', 'jade');
// 配置初始化
config.init();
// 子app默认路由设置
config.set('app.route', '/app');
// 子app默认静态路径设置
config.set('app.static', '/static');
// 子app默认配置文件设置
config.set('app.config', path.join(__dirname, 'app.json'));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// 格式化form-data数据
app.use(multer({dest: '/tmp/server-upload'})); // for parsing multipart/form-data
app.use(cookieParser('LDkdsSAlf4dFGS5'));
app.use(express.static(path.join(__dirname, 'public')));

// router
sup(app).auto();
app.use('/', routes);
// app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
