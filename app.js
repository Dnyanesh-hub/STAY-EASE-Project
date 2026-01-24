//first require express
const express = require("express");
const app = express();
let port = 8080;
//second require mongoose
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");

//connecting with data base
const MONGO_URL = "mongodb://127.0.0.1:27017/stayease";
main()
  .then(() => {
    console.log("connected to database successfully");
  })
  .catch((err) => {
    console.log(err);
  });
async function main() {
  await mongoose.connect(MONGO_URL);
}
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

// index route
app.get("/listings", async (req, res) => {
  const allListing = await Listing.find({});
  res.render("listings/index.ejs", { allListing });
});
//new route
app.get("/listings/new",async (req,res)=>{
    res.render("listings/createNew.ejs");

});
//Show route
app.get("/listings/:id", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/show.ejs", { listing });
});
//create route 
app.post("/listings",async (req,res)=>{
    // let{title,description,image,price,country,location}=req.body;
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
});
// edit route
app.get("/listings/:id/edit",async (req,res)=>{
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
});
//update route
app.put("/listings/:id",async (req,res)=>{
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);    
});

//delete destroy route
app.delete("/listings/:id" , async(req,res)=>{
     let { id } = req.params;
     let deletedListing= await Listing.findByIdAndDelete(id);
     console.log(deletedListing);
     res.redirect("/listings");
});


 



app.get("/", (req, res) => {
  res.send("ROOT SERVER IS WORKING WELL!");
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

app.listen(port, (req, res) => {
  console.log(`app is listening to the ${port} port`);
  //start server on the port 8080
});
