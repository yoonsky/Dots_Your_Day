const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const hashtagRouter = require("./routes/hashtag");
const profileRouter = require("./routes/profile");
const db = require("./models");
const app = express();
const passportConfig = require("./passport");
const passport = require("passport");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");

dotenv.config();
db.sequelize
  .sync()
  .then(() => {
    console.log("db 연결 성공");
  })
  .catch(console.error);

passportConfig();

app.use(
  cors({
    origin: true,
    // origin:true 이것도 가능하다.
    credentials: true,
  })
);

app.use("/", express.static(path.join(__dirname, "uploads")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  session({
    saveUninitialized: false,
    resave: false,
    secret: process.env.COOKIE_SECRET,
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(morgan("dev"));

app.use("/posts", postsRouter); //분리한 라우터 호출
app.use("/post", postRouter); //분리한 라우터 호출
app.use("/user", userRouter); //분리한 라우터 호출
app.use("/hashtag", hashtagRouter); //분리한 라우터 호출
app.use("/profile", profileRouter); //분리한 라우터 호출

const PORT = 5000;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));