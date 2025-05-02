const KakaoStrategy = require('passport-kakao').Strategy;

const { User } = require('../models');

module.exports = (passport) => {
    // 1. 로컬 로그인과 마찬가지로 카카오 로그인에 대한 설정 진행
    // clientID는 카카오에서 발급해줒는 아이디, 노출되지 않아야 해서 process.env.KAKAO_ID로 설정했음
    // callbackURL은 카카오로 부터 인증 결과를 받을 라우터 주소임
    passport.use(new KakaoStrategy({
        clientID: process.env.KAKAO_ID,
        callbackURL: '/auth/kakao/callback',
    // 2. 먼저 기존에 카카오로 로그인한 사용자가 있는지 조회, 있다면 done함수를 호출함
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const exUser = await User.findOne( { where: { snsId: profile.id, provider: 'kakao'}});  
            console.log(profile._json, '이거 실행되는거 맞음?');            
            if (exUser) {                
                done(null, exUser);
            // 3. 없다면 회원가입 진행
            // 카카오에서는 인증 후 callbackURL주소로 accessToken, refreshToken, profile을 보내줌
            // profile에는 사용자 정보들이 들어 있음, 데이터는 console.log 메서드로 확인해 보는 것이 좋음(뭘 보내주는지)
            // profile 객체에서 원하는 정보를 꺼내와 회원가입을 진행
            // 사용자를 생성한 뒤 done 함수를 호출
            } else {                
                const newUser = await User.create({
                    // 카카오 디렙롭 일반 계정에서는  닉네임, 프로필 사진, 카카오 서비스 내 친구목록 만 가져올 수 있음)
                    email: profile._json && profile._json.kaccout_email,  
                    nick: profile.displayName,
                    snsId: profile.id,
                    provider: 'kakao',
                });
                done(null, newUser);
            }
        } catch (error) {
            console.log('암것도 못가져왔지롱');
            console.error(error);
            done(error);
        }
    }));
};