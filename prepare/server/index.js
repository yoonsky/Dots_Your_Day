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
const hpp = require("hpp");
const helmet = require("helmet");

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
    origin: ["http://localhost:3000", "dotyourday.com", "http://13.125.13.8/"],
    // origin:true 이것도 가능하다.
    credentials: true,
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(morgan("combined"));
  app.use(hpp());
  app.use(helmet());
} else {
  app.use(morgan("dev"));
}

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

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/posts", postsRouter); //분리한 라우터 호출
app.use("/post", postRouter); //분리한 라우터 호출
app.use("/user", userRouter); //분리한 라우터 호출
app.use("/hashtag", hashtagRouter); //분리한 라우터 호출
app.use("/profile", profileRouter); //분리한 라우터 호출

const PORT = 80;
app.listen(PORT, () => console.log(`server running on port ${PORT}`));
