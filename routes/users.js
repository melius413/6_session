var path = require('path');
var express = require('express');
var router = express.Router();
var { connect } = require(path.join(__dirname, '../modules/mysql-connect')); // 서비스 플랫폼에 따라 상대경로가 안 먹을 수도 있음

/* GET users listing. */
router.get(['/', '/login'], function (req, res, next) {
  // res.send('respond with a resource');
  const values = {
    title: '로그인'
  }
  res.render('login.pug', values);
});

router.get('/join', (req, res, next) => {
  const values = {
    title: '회원가입'
  }
  res.render('join.pug', values);
});

router.post('/save', (req, res, next) => {
  res.redirect('/user');
});

module.exports = router;
