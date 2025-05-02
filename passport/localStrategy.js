const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

const { User } = require('../models');

module.exports = (passport) => {
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, async (email, password, done) => {  // 세 번째 매개변수인 done 함수는 passport.authenticate의 콜백 함수이다.
    try {
        const exUser = await User.findOne({where: { email }});      
      if (exUser) {
        const result = await bcrypt.compare(password, exUser.password);
        if (result) {
            console.log(exUser.id, "찾았다. 로그인하자.");
            done(null, exUser);
        } else {
          done(null, false, { message: '비밀번호가 일치하지 않습니다.' });
        }
      } else {
        console.log(exUser.email, "정보가 없는데!");
        done(null, false, { message: '가입되지 않은 회원입니다.' });
      }
    } catch (error) {
      console.error(error);
      done(error);
    }
  }));
};
