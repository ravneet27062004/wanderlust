const mongoose = require("mongoose");
const Schema =mongoose.Schema;
const Review = require("./review.js")


const listingSchema = new Schema({
    title :{
      type:  String,
      required: true,
    },
    description :{
        type:  String,
        required: true,
      },
    image :{
     
      url:String,
     filename:String,
      },
    price :Number,
location:String,
country:String,
review:[
  {
    type: Schema.Types.ObjectId,
    ref:"Review"
  }
],
owner:{
type:Schema.Types.ObjectId,
ref:"User",
}
//yah ma krugi 
// categoey:{
//   type:String,
//   enum:["mountains","arctic","pool","farm","deserts",""]
// }
});
listingSchema.post("findOneAndDelete",async(listing)=>{
if(listing){
await Review.deleteMany({_id:{$in:listing.review}})
}
  
})


const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;