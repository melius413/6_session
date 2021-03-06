var createError = require('http-errors');
var express = require('express');
var path = require('path');
var dotenv = require('dotenv').config();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
// var sessionStore = require('session-file-store')(session); // occur rename error
var LokiStore = require('connect-loki')(session);

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var boardRouter = require('./routes/board');

var app = express();
// var salt = 'mySalt!@#$';

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.locals.pretty = true;
// app.set('trust proxy', 1); // for session, needed?
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: process.env.salt, // salt로써, 암호화 할때 사용
  resave: true, // 존재하면 다시 저장여부 설정(세션이 자꾸 바뀌는 경우는 true)
  saveUninitialized: true, // 초기화 여부
  // https://www.npmjs.com/package/express-session
  // Compatible Session Stores, 저장할수 있는 매체 리스트
  // store: new sessionStore({}) // 세션 저장위치, 해당 설정값 없으면 메모리저장, 해당 모듈은 가끔 아래 오류를 발생시킴
  // [Error: EPERM: operation not permitted, rename '***.json.4225269665' -> '***.json']
  store: new LokiStore({})
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/user', usersRouter);
app.use('/board', boardRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  if (err) console.error('error rc:', err);

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
