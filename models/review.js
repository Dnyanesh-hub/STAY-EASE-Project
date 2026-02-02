const mongoose = require("mongoose");
const Schema = mongoose.Schema; //storing mongoose.schema into schema variable so that we canuse schema variable instead of moongose.schema

const reviewSchema = new Schema({
  comment: String,
  rating: {
    type: Number,
    min: 1,
    max: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});
module.exports=mongoose.model("Review",reviewSchema);
