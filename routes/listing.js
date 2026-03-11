const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const Listing = require("../models/listing.js");
const {
  LoggedIN,
  isLoggedIN,
  isOwner,
  validateListing,
} = require("../middleware.js");
//middleware for validate schema

// index route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListing = await Listing.find({});
    res.render("listings/index.ejs", { allListing });
  }),
);
//new route
router.get(
  "/new",
  isLoggedIN,
  wrapAsync(async (req, res) => {
    res.render("listings/createNew.ejs");
  }),
);
// show  route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path:"author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing you requested for  does not exist");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  }),
);
//create  route
router.post(
  "/", // let{title,description,image,price,country,location}=req.body;
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  isLoggedIN,
  validateListing,
  wrapAsync(async (req, res, next) => {
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  }),
);
// edit route
router.get(
  "/:id/edit",
  isLoggedIN,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "listing you requested for does not exist!");
    }
    res.render("listings/edit.ejs", { listing });
  }),
);
//update route
router.put(
  "/:id",
  isLoggedIN,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "listing Updated");
    res.redirect(`/listings/${id}`);
  }),
);
//delete destroy route
router.delete(
  "/:id",
  isLoggedIN,
  isOwner,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted");
    res.redirect("/listings");
  }),
);
module.exports = router;
