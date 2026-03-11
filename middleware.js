// we are bringing listing from database so we need to require listing model
const Listing=require("./models/listing")
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");
module.exports.isLoggedIN=(req,res,next)=>{
     if(!req.isAuthenticated()){
      req.session.redirectUrl=req.originalUrl;
      req.flash("error","you must be logged in to create listing");
      return res.redirect("/login");
    }
    next();
}
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        delete req.session.originalUrl;
    }
    next(); 
}
module.exports.isOwner = async (req,res,next)=>{
    let { id } = req.params;
    let listing= await Listing.findById(id);
    if(! currUser && listing.owner._id.equals(res.locals.currUser._id))
    {
      //IF THE ACCESING OWNER IS DIFFRENT THEN 
      req.flash("error","You dont have access to update listing");
      return res.redirect(`/listings/${id}`);
    } 
    next();
}

module.exports. validateListing = (req, res, next) => {
  let { error } = listingSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, errMsg);
  } else {
    next();
  }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errmsg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};