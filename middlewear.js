const Listing =require("./models/listing")
    const ExpressError = require("./utils/expresserror.js")
    const {listingschema,reviewschema} = require("./schema.js");
const Review = require("./models/review.js");
const wrapAsync = require("./utils/wrapasync.js");

    module.exports.isLoggedin = (req,res,next)=>{
if(!req.isAuthenticated()){
        //redirecturl
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","you must be logged in to create listing! ");
         return res.redirect("/login")
              } 
              next();
}
module.exports.saveredirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};
module.exports.isowner = async (req,res,next)=>{
    let {id}= req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner._id.equals(res.locals.curruser._id)){
      req.flash("error","You are not owner of this listing ");
      return res.redirect(`/listings/${id}`);
    }
    next();
}
// module.exports.validateListing = (req,res,next)=>{
//     let {error} = listingschema.validate(req.body);
    
//     if(error){
//    const  errmsg = error.details.map((el)=>el.message).join(",")
//       throw new ExpressError(400,errmsg)
//     }else{next()}
//   }
module.exports.validateListing = (req, res, next) => {
  console.log('validateListing called, req.body:', req.body);
  let { error } = listingschema.validate(req.body);

  if (error) {
      const errmsg = error.details.map((el) => el.message).join(',');
      console.error('Validation error:', errmsg);
      throw new ExpressError(400, errmsg);
  }
  next();
};

  module.exports.validateReview= (req,res,next)=>{
    let {error} = reviewschema.validate(req.body);
    
    if(error){
      let errmsg = error.details.map((el)=>el.message.join(","))
      throw new ExpressError(400,errmsg)
    }else{next()}
  }
  module.exports.reviewauthor = async (req,res,next)=>{
    let {id,reviewId}= req.params;
    let review= await Review.findById(reviewId);
    if(!review.author.equals(res.locals.curruser._id)){
      req.flash("error","You are not author of this review ");
      return res.redirect(`/listings/${id}`);
    }
    next();
}

