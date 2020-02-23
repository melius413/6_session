var path = require('path');
var express = require('express');
var crypto = require('crypto');
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

router.get('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    res.redirect('/');
  });
});

router.post('/save', async (req, res, next) => {
  // 비구조화 할당(값을 바로 할당할 수 있음)
  let { userid, userpw, username, createdAt = new Date(), grade = 1 } = req.body;
  userpw = crypto.createHash('sha512').update(userpw + process.env.salt).digest('base64');
  let sql = "INSERT INTO user SET userid=?, userpw=?, username=?, createdAt=?, grade=?";
  let value = [userid, userpw, username, createdAt, grade];
  try {
    // execute(): 연결, 쿼리, 연결끊기를 한번에 해줌
    let result = await connect.execute(sql, value);
    // res.json(result);
    res.redirect('/user');
  } catch (err) {
    next(err); // 에러를 다 보여주면 해킹의 위험이 있음
  }
});

router.post('/loginModule', async (req, res, next) => {
  let { userid, userpw } = req.body;
  userpw = crypto.createHash('sha512').update(userpw + process.env.salt).digest('base64');
  let sql = "SELECT userid, grade, username FROM user WHERE userid=? AND userpw=?";
  let value = [userid, userpw];
  let result = await connect.execute(sql, value);
  // res.json(result[0]);
  if (result[0][0]) {
    // 세션은 req객체에 있음
    req.session.userid = result[0][0].userid;
    req.session.username = result[0][0].username;
    req.session.grade = result[0][0].grade;
    // 세션정보가 sessions 폴더의 파일에 저장됨
    res.redirect('/');
  } else {
    res.send(`
    <script>
    alert("아이디와 패스워드를 확인하세요.");
    location.href ="/";
    </script>
    `);
  }
});

module.exports = router;