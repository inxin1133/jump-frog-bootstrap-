require('dotenv').config();
const express = require('express');
const expressLayouts = require("express-ejs-layouts");
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const asyncHandler = require("express-async-handler");
const passport = require('passport');
// const methodOverride = require("method-override");



// DB의 연결을 도와줌
const { sequelize } = require('./models');

// 서비스를 사용할 수 있게끔 해주는 여권 같은 역할을 하는 모듈
// 세션과 쿠키 처리 등 복잡한 잡업이 많으므로 검증된 모듈을 사용 - passport
// require('./passport') 는 require('./passport/index.js')와 동일함
const passportConfig = require('./passport');

const app = express();
sequelize.sync();
passportConfig(passport);




app.set('port', process.env.PORT || 3001);

// ejs 엔진 사용할 거라고 선언, views폴더 사용
app.use(expressLayouts);
app.set("view engine", "ejs");
// app.set("views", "./views");
app.set('views', path.join(__dirname, 'views'));



// 정적인 파일 위치 설정 (css, img 파일 등)
// app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));

app.use(morgan('combined')); // mode 옵션 : common, combined, dev, short, ...ETC 사용자 정의
// app.use('/img', express.static(path.join(__dirname, 'uploads')));




// 메소드 오버라이드를 이용해 GET, POST 요청을 PUT, DELETE로 전환하여 사용하도록 함
// 사용할 때 "_method" 이런 방식으로 사용할 것이라고 선언
// app.use(methodOverride("_method"));

// 본문 요청 내용이나 다양한 정보(body 등)를 파싱
app.use(express.json());
// POST 요청에서 본문(body) 정보를 req 객체에 올려서 보내는 역할 
// 예) req.body.username  req.body.password
app.use(express.urlencoded({ extended: true }));
// 쿠키파서 미들웨어 사용
app.use(cookieParser(process.env.COOKIE_SECRET));
// 세션 설정
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,   
    cookie:{
        httpOnly: true,
        secure: false,    
    },
}));
app.use(flash());

// passport.initialize() 미들웨어는 요청(req객체)에 passport 설정을 심고, 
app.use(passport.initialize());
// passport.session() 미들웨어는 req.session 객체에 passport 정보를 저장함
app.use(passport.session());





// 라우터 연결
app.use("/", require("./routes/home"));
app.use("/auth", require("./routes/auth"));
// app.use("/post", require("./routes/post"));
app.use("/user", require("./routes/user"));



// flssh 테스트
app.get('/show-msg', (req, res) => {
    req.flash('info', 'welcome to the homepage!');
    res.redirect('/show-message');
});

// flash 메시지 받기
app.get('/show-message', (req, res) => {
    const message = req.flash('info');
    res.send(message); 
})



const errorLayout = "../views/layout_error";
// const homeLayout = "../views/layout_home";


app.use('/about', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'table.html'));
});


app.get('/test', asyncHandler(async(req, res) => {
    console.log('1요청');
    req.user = 'Chayul';    
    console.log(req.user);
    const locals = {
        title: "Jump test",
        named: req.user,
    }; 
    res.render('test', {locals, layout: errorLayout});
}));

// router.get("/add", checkLogin, asyncHandler(async(req, res) => {
//     const locals = {
//         title: "게시물 작성"
//     }
//     res.render("admin/add", {locals, layout:adminLayout});
// }));


// 
app.use('/error', async(req, res, next) => {
    try {
        에러발생
        res.render('error', {layout: errorLayout})
        // console.error("문제가 없습니다. ");
        // console.log('2요청');
        // req.msg = 'end';   
        // req.user = 'Knagwoo';     
        // res.writeHead('200', {'content-type':'text/html;charset=utf8'});
        // res.write('<h1>Express 서버에서 ' + req.user + '가 응답한 결과입니다.</h1>');
        // res.end('<h2>서버 요청 후 응답을' + req.msg + '해야 서버가 계속해서 돌아가지 않습니다.</h2>');
        console.log('문제없이 종료');
        res.end();
        
      } catch (error) {
        
        // console.error("문제가 발생했습니다. ");
        // const error = new Error('무언가 문제가 발생!');
        console.error(error);
        console.error('문제발생해서 종료');
        
        // console.error("이름 : " + error.name);
        // console.error("메시지 : " + error.message);
        // console.error("스택 : " + error.stack);    
        // console.error('문제발생해서 종료');
        // res.send(`<script>alert('에러가 발생해서 홈으로 복귀합니다.');location.href='/';</script>`);
        // alert은 render된 페이지에 접속하는 것이라서 알럿창이 반응을 안함, 하지만 페이지는 자동으로 이동함
        // res.redirect('/');
        // res.end();
        return next(error); // 오류를 다음 미들웨어로 넘김
        
      }
});




// 오류처리 미들웨어
app.use((err, req, res, next) => {
    console.error("미들웨어에서 받아서 처리");
    console.error(err.message);
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // const errbox = err.name;
    // const locals = {
    //     title: "Error Page",
    //     errname : errbox,
    // };
    err.status = 501;
    res.status(err.status || 500);
    const locals = {
        title: "에러발생",
    };
    // res.status(500).json({message: err.message});
    // res.render('error');    
    res.render('error', {locals, layout : '../views/layout_error'});    
});

app.use((req, res, next) => {
    const err = new Error('Not Found-찾을 수 없음');
    err.status = 404;
    next(err);
});




app.listen(app.set('port'), () => {
    console.log(app.set('port'), '번 포트에서 대기 중');
});


