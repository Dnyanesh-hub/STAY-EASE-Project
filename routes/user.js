const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController=require("../controllers/user.js");

// signup page
router.get("/signup", (userController.renderSignupForm));

// signup logic
router.post(
  "/signup",
  wrapAsync(userController.signup),
);

// login page
router.get("/login", (req, res) => {
  res.render("users/login");
});

// login logic
router.post(
  "/login",
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  async (req, res) => {
    req.flash("success", "Welcome back to Stay-Ease !");
    const redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
  },
);

// logout
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);

    req.flash("success", "Logged out successfully");
    res.redirect("/listings");
  });
});

module.exports = router;
