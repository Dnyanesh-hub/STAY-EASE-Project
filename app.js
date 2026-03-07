//first require express
const express = require("express");
const app = express();
let port = 8080;
//second require mongoose
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter=require("./routes/user.js");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

require("events").defaultMaxListeners = 50;
//connecting with data base
const MONGO_URL = "mongodb://127.0.0.1:27017/stayease";
main()
  .then(() => {
    console.log("connected to database successfully");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));
const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 100, // cookie will expire after one week form date today
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.get("/", (req, res) => {
  res.send("ROOT SERVER IS WORKING WELL!");
});
app.use(session(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser=req.user;
  next();
});
//register route
// app.get("/demouser", async (req, res) => {
//   let fakeUser = new User({
//     email: "student@gmail.com",
//     username: "delta-student",
//   });
//   let registerdUser= await User.register(fakeUser,"helloworld");
//   res.send(registerdUser);
// });

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/",userRouter);

//middleware to handle middleware

app.use((req, res, next) => {
  next(new ExpressError(404, "Page Not Found! "));
});

app.use((err, req, res, next) => {
  // console.log(err);
  let { status = 500, message = "something Went wrong" } = err;
  res.status(status).render("./listings/error.ejs", { message });
  // res.status(status).send(message);
});

app.listen(port, (req, res) => {
  console.log(`app is listening to the ${port} port`);
  //start server on the port 8080
});
