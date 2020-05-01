var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var app = express();




//引入bodyparser接受post请求  (*****必须放在其他模块的上面*****)
var bodyParser = require("body-parser")
//配置bodyparser模块
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json());

//引入mongoose模块
const mongoose = require("mongoose")
//引入数据库服务器地址文件
const db = require("./config/keys").mongoURL

//链接mongodb数据库
mongoose.connect(db).then(()=>{
  console.log("数据库连接成功")
}).catch(error=>{
  console.log("数据库连接失败:"+error)
})

//引入user二级路由文件
const users = require("./routes/api/users")

//引入profiles.js二级路由文件
const profiles = require("./routes/api/profiles")
//挂在一级路由上
app.use("/api/users",users);
app.use("/api/profiles",profiles);

//引入passport模块
const passport = require("passport");
//对passport进行初始化
app.use(passport.initialize());
//引入passport.js文件
require("./config/passport.js")(passport);



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
