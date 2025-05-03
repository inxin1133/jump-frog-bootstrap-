const express = require('express');

const { isLoggedIn } = require('./middlewares');
const { User } = require('../models');

const router = express.Router();

router.post('/:id/follow', isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id }});
        await user.addFollowing(parseInt(req.params.id, 10)); // 시퀄라이즈에서 추가한 addFollowing 메서드로 현재 로그인한 사용자와의 관계를 지정함
        res.send('success');
    } catch (error) {
        console.error(error);
        next(error);
    }
});


module.exports = router;

