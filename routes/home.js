const express = require('express');

// const asyncHandler = require("express-async-handler");
const router = express.Router();
const homeLayout = "../views/layout_home";




// const asyncHandler = require("express-async-handler");



router.get(['/', '/home'], (req, res) => {
    const locals = {
        title: "Jump Frog"
    };    
    res.render('home', {locals, layout: homeLayout});
});




router.get('/join', (req, res) => {
    const locals = {
        title: "Sign up",
        user: req.user,
        joinError: req.flash('회원이메일이 이미 있습니다.'),
        // joinError: "가입하러왔음?",        
    };    
    res.render('join', {locals, layout: homeLayout});
});









module.exports = router;