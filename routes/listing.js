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
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
//middleware for validate schema
//router.route for index and create route
router
  .route("/")
  .get(wrapAsync(listingController.index))
  // .post(
  //   isLoggedIN,
  //   validateListing,
  //   wrapAsync(listingController.createListing),
  // );
  .post(upload.single("listing[image]"), (req, res) => {
    res.send(req.file);
  });
//new route
router.get("/new", isLoggedIN, wrapAsync(listingController.renderNewForm));
// router.route for update delete show route
router
  .route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIN,
    isOwner,
    validateListing,
    wrapAsync(listingController.updateListing),
  )
  .delete(isLoggedIN, isOwner, wrapAsync(listingController.destroyListing));

// edit route
router.get(
  "/:id/edit",
  isLoggedIN,
  isOwner,
  wrapAsync(listingController.editListings),
);

module.exports = router;
