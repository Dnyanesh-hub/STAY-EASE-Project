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
const listingController = require("../controllers/listings.js");
//middleware for validate schema

// index route
router.get("/", wrapAsync(listingController.index));
//new route
router.get("/new", isLoggedIN, wrapAsync(listingController.renderNewForm));
// show  route
router.get("/:id", wrapAsync(listingController.showListings));
//create  route
router.post(
  "/", // let{title,description,image,price,country,location}=req.body;
  // if (!req.body.listing) {
  //   throw new ExpressError(400, "Send valid data for listing");
  // }
  isLoggedIN,
  validateListing,
  wrapAsync(listingController.createListing),
);
// edit route
router.get(
  "/:id/edit",
  isLoggedIN,
  isOwner,
  wrapAsync(listingController.editListings),
);
//update route
router.put(
  "/:id",
  isLoggedIN,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing),
);
//delete destroy route
router.delete(
  "/:id",
  isLoggedIN,
  isOwner,
  wrapAsync(listingController.destroyListing),
);
module.exports = router;
