//first require express
const express=require("express");
const app=express();
let port=8080;
//second require mongoose
const mongoose=require("mongoose");
const Listing=require("./models/listing.js");
const path=require("path");
//connecting with data base
const MONGO_URL="mongodb://127.0.0.1:27017/stayease";
main().
  then(()=>{
    console.log("connected to database successfully")

}).catch((err)=>{
    console.log(err);

});
async function main () {
    await mongoose.connect(MONGO_URL);
}
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"/views"));
app.use(express.urlencoded({extended:true})); 

// index route 
app.get("/listings",  async (req,res)=>{
    const allListing= await Listing.find({});
    res.render("listings/index.ejs",{allListing});

});
//Show route
app.get("/listings/:id",async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/show.ejs",{listing});
});


app.get("/",(req,res)=>{
    res.send("ROOT SERVER IS WORKING WELL!")

});

// app.get("/testlisting",async (req,res)=>{
//     let sampleListing=new Listing({
//         title:"My New Villa",
//         description:"By the beach",
//         price:1200,
//         location:"Calngute ,Goa",
//         country:"India"
//     }) 
//     await sampleListing.save();
//     console.log("Sample was saved");
//     res.send("Successful testing");


// });

app.listen(port,(req,res)=>{
    console.log(`app is listening to the ${port} port`);
//start server on the port 8080
});


