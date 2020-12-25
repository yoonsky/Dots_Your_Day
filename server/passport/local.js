const passport = require("passport");
const bcrypt = require("bcrypt");

const { Strategy: LocalStrategy } = require("passport-local");
const { User } = require("../models");

module.exports = () => {
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      async (email, password, done) => {
        try {
          const user = await User.findOne({
            where: { email },
          });
          if (!user) {
            //이메일이 없는경우
            return done(null, false, {
              reason: "가입되지 않은 이메일 입니다.",
            });
            //서버에러, 성공, 클라이언트 에러
          }
          const result = await bcrypt.compare(password, user.password);
          if (result) {
            //비밀번호가 일치하는 경우
            console.log(user);
            return done(null, user);
          }
          return done(null, false, { reason: "비밀번호가 올바르지 않습니다." });
        } catch (error) {
          console.error(error);
          return done(error);
        }
      }
    )
  );
};