var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  // let sess = {
  //   userid: req.session.userid,
  //   username: req.session.username,
  //   grade: req.session.grade,
  // };
  // res.json(sess);
  if (req.session.userid) {
    res.render('index', { title: 'Express' });
  } else {
    res.redirect("/user/login");
  }
  // res.render('index', { title: 'Express' });
});

module.exports = router;
