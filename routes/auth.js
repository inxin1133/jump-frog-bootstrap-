const express = require('express');
// const passport = require('passport');
const bcrypt = require('bcrypt');
// const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

// 회원가입 라우터
// 기존에 같은 이메일 가입자 있는지 조회, 있다면 flash메시지를 설정하고 회원가입 페이지로 되돌려 보냄
// 없다면 비밀번호 암호화 하고, 사용자 정보를 생성함
// bcrypt를 사용해 암호화, 숫자가 커지면 비밀번호가 더 복잡해짐, 너무 많으면 암호화 시간 많이 걸림, 12 적당 (31까지 작성가능)
router.post('/join', async (req, res, next) => {
    const { email, nick, password } = req.body;
    try {
        const exUser = await User.findOne({where: { email }});
        const locals = { joinError : "메일이 이미 등록되어 있어"};
        if (exUser) {
            req.flash('joinError');
            console.log(exUser.email , '이미 가입되어있어!');          
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


module.exports = router;