const mongoose = require("mongoose");
const review = require("./review.js");
const Schema = mongoose.Schema;

// Listing Schema
const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
  },

  image: {
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

  // ✅ FIXED GEOJSON FIELD
  geometry: {
    type: {
      type: String, // MUST be String (not string)
      enum: ["Point"], // MUST be capital "Point"
      required: true,
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true,
    },
  },
});

// ✅ Add geospatial index (important for maps)
listingSchema.index({ geometry: "2dsphere" });

// ✅ Post middleware to delete related reviews
listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    await review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

// Create model
const Listing = mongoose.model("Listing", listingSchema);

module.exports = Listing;