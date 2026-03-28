const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const {
  isLoggedIN,
  isOwner,
  validateListing,
} = require("../middleware.js");

const listingController = require("../controllers/listings.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

// Index + Create
router.route("/")
  .get(wrapAsync(listingController.index))
  .post(
    isLoggedIN,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

// New
router.get("/new", isLoggedIN, wrapAsync(listingController.renderNewForm));

// Show + Update + Delete
router.route("/:id")
  .get(wrapAsync(listingController.showListings))
  .put(
    isLoggedIN,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  .delete(
    isLoggedIN,
    isOwner,
    wrapAsync(listingController.destroyListing)
  );

// Edit
router.get(
  "/:id/edit",
  isLoggedIN,
  isOwner,
  wrapAsync(listingController.editListings)
);

module.exports = router;