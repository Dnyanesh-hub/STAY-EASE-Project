//first require express
const express = require("express");
const app = express();
let port = 8080;
//second require mongoose
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema } = require("./schema.js");

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

// index route
app.get(
  "/listings",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  }),
);
//middleware for validate schema
const validateListing = (req, res, next) => {
  let {error} = listingSchema.validate(req.body);
  
  if (error) {
    let errMsg=error.details.map((el)=>el.message).join(",");
    throw new ExpressError(400, errMsg);
  }else{
    next();
  }
};
//new route
app.get(
  "/listings/new",
  wrapAsync(async (req, res) => {
    res.render("listings/createNew.ejs");
  }),
);
//Show route
app.get(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs", { listing });
  }),
);
//create route
app.post(
  "/listings",validateListing,
  wrapAsync(async (req, res, next) => {
    // let{title,description,image,price,country,location}=req.body;
    // if (!req.body.listing) {
    //   throw new ExpressError(400, "Send valid data for listing");
    // }

    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
  }),
);
// edit route
app.get(
  "/listings/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  }),
);
//update route
app.put(
  "/listings/:id",validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  }),
);

//delete destroy route
app.delete(
  "/listings/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  }),
);

app.get("/", (req, res) => {
  res.send("ROOT SERVER IS WORKING WELL!");
});

// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calngute ,Goa",
//         country:"India"
//     })
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");

// });

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
