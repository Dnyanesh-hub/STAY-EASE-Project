const mongoose=require("mongoose");
const Schema=mongoose.Schema;//storing mongoose.schema into schema variable so that we canuse schema variable instead of moongose.schema

const listingSchema=new Schema({
    title:{
        type:String,
        required:true,


    },
    description:{
        type:String,

    },
    image:{
        type:String,
        //we want add default image for the place if user dont have any image of the place
        //setting image filed value
        default:
            "https://images.unsplash.com/photo-1768590149180-fb8b111db951?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D",

        set: (v) =>
          v === ""
          ? "https://images.unsplash.com/photo-1768590149180-fb8b111db951?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxOHx8fGVufDB8fHx8fA%3D%3D"
          : v,
    },
    price:{
        type:Number,

    },
    location:{
        type:String,

    },
    country:{
        type:String,

    }
});
const Listing=mongoose.model("Listing",listingSchema);// creating model 
module.exports=Listing; //exporting model

