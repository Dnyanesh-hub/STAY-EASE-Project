// ================== BASIC SETUP ==================
const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const port = 8080;

// ================== DEPENDENCIES ==================
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const session = require("express-session");

// IMPORTANT FIX HERE
const MongoStore = require("connect-mongo").default;

const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

// ================== DATABASE ==================
const dbUrl = process.env.ATLASDB_URL;

mongoose
  .connect(dbUrl)
  .then(() => console.log("Connected to DB"))
  .catch((err) => console.log("DB Error:", err));

// ================== VIEW ENGINE ==================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.engine("ejs", ejsMate);

// ================== MIDDLEWARE ==================
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "/public")));

// ================== SESSION STORE ==================
const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET ,
  },
  touchAfter: 24 * 3600,
});

// Error handling for session store
store.on("error", (err) => {
  console.log("SESSION STORE ERROR:", err);
});

// ================== SESSION CONFIG ==================
const sessionOptions = {
  store: store,
  secret: process.env.SECRET ,
  resave: false,
  saveUninitialized: false,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    secure: false, //  set true only in production with HTTPS
    sameSite: "lax",
  },
};

app.use(session(sessionOptions));

// Debug session
app.use((req, res, next) => {
  console.log("Session ID:", req.sessionID);
  next();
});

app.use(flash());

// ================== PASSPORT ==================
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// ================== GLOBAL VARIABLES ==================
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});

// ================== ROUTES ==================
app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);

// ================== 404 ==================
app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// ================== ERROR HANDLER ==================
app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("listings/error.ejs", { message });
});

// ================== SERVER ==================
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});