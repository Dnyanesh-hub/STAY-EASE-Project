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
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
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

app.get("/", (req, res) => {
  res.send("ROOT SERVER IS WORKING WELL!");
});

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);

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
