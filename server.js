const express = require("express");
const path = require("path");
const logger = require("morgan");
const mongoose = require("mongoose");
const bp = require('body-parser');
const passport = require('passport');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session      = require('express-session');
// const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 3001;

app.use((req, res, next) => {
  // console.log("custom middleware");
  res.setHeader("Access-Control-Allow-Origin", "*");
  next();
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

app.use(express.static("client/"));

app.use(logger('dev'));
app.use(cookieParser());
app.use(bp.json());
app.use(bp.urlencoded({
  extended: true
}));

// required for passport
app.use(session({
  secret: 'ilovescotchscotchyscotchscotch', // session secret
  resave: true,
  saveUninitialized: true,
  cookie: {
    secure: false
  }
}));

var sess = {
  secret: 'keyboard cat',
  cookie: { value: "sest"}
}

// app.use(session(sess));

// app.set('trust proxy', 1) // trust first proxy
// sess.cookie.secure = true

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/liri");
require('./config/passport')(passport);
const db = require("./models");

require('./controllers/api-routes.js')(app, db, passport);

// app.get("/home", (req, res) => {
//   res.sendFile(path.join(__dirname, "./views/test.html"));
// });

app.get("*", (req, res) => res.sendFile(path.join(__dirname, "./client/index.html")));

app.listen(PORT, () => console.log(`🌎 ==> Server now on port ${PORT}!`));
