const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

// 회원가입 라우터
// 기존에 같은 이메일 가입자 있는지 조회, 있다면 flash메시지를 설정하고 회원가입 페이지로 되돌려 보냄
// 없다면 비밀번호 암호화 하고, 사용자 정보를 생성함
// bcrypt를 사용해 암호화, 숫자가 커지면 비밀번호가 더 복잡해짐, 너무 많으면 암호화 시간 많이 걸림, 12 적당 (31까지 작성가능)
router.post('/join', isNotLoggedIn, async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({ where: { email } });
        const locals = { joinError: "메일이 이미 등록되어 있어" };
        if (exUser) {
            req.flash('joinError');
            console.log(exUser.email, '이미 가입되어있어!');
            return res.redirect('/join');
        }
        const hash = await bcrypt.hash(password, 12);
        await User.create({
            email,
            nick,
            password: hash,
        });
        return res.redirect('/join');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 로그인 라우터
// passport.authenticate('local') 미들웨어가 로컬 로그인 전략을 수행, 미들웨어인데 라우터 미들웨어 안에 들어 있음
// 미들웨어에 사용자 정의 기능을 추가하고 싶을 때 보통 이렇게 함
router.post('/login', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local', (authError, user, info) => {
        if (authError) {
            console.error(authError);
            console.log('로그인 처리 안됨1');
            return next(authError);
        }
        if (!user) {
            req.flash('loginError', info.message);
            console.log('로그인 처리 안됨2');
            return res.redirect('/');
        }
        return req.login(user, (loginError) => {
            if (loginError) {
                console.error(loginError);
                return next(loginError);
            }
            console.log('로그인 레츠고');
            return res.redirect('/');
        });
    })(req, res, next); // 미들웨어 내의 미들웨어에는 (req, res, next)를 붙입니다.
});

// 로그아웃 라우터
// req.logout 메서드는 req.user 객체를 제거하고, 
// req.session.destroy는 req.session 객체의 내용을 제거함
router.get('/logout', isLoggedIn, (req, res, next) => {
    req.logout((err) => {
      if (err) {
        return next(err); // 에러가 발생하면 다음 미들웨어로 전달
      }
      req.session.destroy();
      res.redirect('/');
    });  
  });

//카카오 인증 로그인 또는 회원생성
router.get('/kakao', passport.authenticate('kakao'));

router.get('/kakao/callback', passport.authenticate('kakao', {
    failureRedirect: '/',
}), (req, res) => {
    res.redirect('/');
});




module.exports = router;