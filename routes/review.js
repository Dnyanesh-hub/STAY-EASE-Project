const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {validateReview}=require("../middleware.js")

// middleware to validate comment or review

//reviews route
//post route
router.post(
  "/",
  validateReview,
  wrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success","new review created!")
    res.redirect(`/listings/${listing._id}`);
  }),
);
// delete review
router.delete(
  "/:reviewid",
  wrapAsync(async (req, res) => {
    let { id, reviewid } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });
    let deletedReview = await Review.findByIdAndDelete(reviewid);
    console.log(deletedReview);
    req.flash("success","review deleted");
    res.redirect(`/listings/${id}`);
  }),
);
module.exports = router;
