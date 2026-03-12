const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");

const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const {
  validateReview,
  isLoggedIN,
  isReviewAuthor,
} = require("../middleware.js");
const review = require("../models/review.js");
const reviewController = require("../controllers/review.js");

// middleware to validate comment or review

//reviews route
//post route
router.post(
  "/",
  isLoggedIN,
  validateReview,
  wrapAsync(reviewController.createReview),
);
// delete review
router.delete(
  "/:reviewid",
  isLoggedIN,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview),
);
module.exports = router;
