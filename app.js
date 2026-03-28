//first require express
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 8080;

const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

//  DB Connection
const dbUrl = process.env.ATLASDB_URL;

mongoose.connect(dbUrl)
  .then(() => console.log(" Connected to DB"))
  .catch(err => console.log(err));

// 🔧 View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);

// 🔧 Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

//  SESSION CONFIG (FIXED)
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: false, // ✅ FIXED
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 100, // ✅ FIXED
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
     secure: false, 
    sameSite: "lax",
  },
};

app.use(session(sessionOptions));


app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  next();
});
app.use(flash());

//  PASSPORT SETUP
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//  GLOBAL VARIABLES (VERY IMPORTANT)
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

//  ROUTES
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

//  404 Handler
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

//  Error Handler
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

//  SERVER
app.listen(port, () => {
  console.log(` App is listening on port ${port}`);
});