const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema; //storing mongoose.schema into schema variable so that we canuse schema variable instead of moongose.schema

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  image: {
    //we want add default image for the place if user dont have any image of the place
    //setting image filed value
    url: String,
    filename: String,
  },
  price: {
    type: Number,
  },
  location: {
    type: String,
  },
  country: {
    type: String,
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});
//post mongoose middleware
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});
const Listing = mongoose.model("Listing", listingSchema); // creating model
module.exports = Listing; //exporting model
