const express = require("express");
const router = express.Router();
const wrapAsync =  require("../utils/wrapasync.js")

const Listing=require("../models/listing.js")
const {isLoggedin, isowner,validateListing} = require("../middlewear.js")
const listingcontroller=require("../controllers/listing.js")

const multer  = require('multer')
const {storage} = require("../cloudconfig.js")
const upload = multer({storage })

router.route("/")
//index 
  .get(wrapAsync(listingcontroller.index))
   //create route
  .post(isLoggedin,
    upload.single('listing[image]'), validateListing,
    wrapAsync (listingcontroller.createListing))
    
  
      //new route
  router.get("/new",isLoggedin,listingcontroller.rendernew)
   
 

router.route("/:id")
 //show route
.get(wrapAsync(listingcontroller.showlisting))
//update
.put(
  isLoggedin,
  isowner,
  upload.single('listing[image]'),
  validateListing,
  wrapAsync(listingcontroller.updatelisting))
  //delete
  .delete(
    isLoggedin,
    isowner,
    wrapAsync(listingcontroller.deletelisting))

  
  
  


    
    
    
  
   
    //edit route
    router.route("/:id/edit")
    .get( isLoggedin,
      isowner,
  
      wrapAsync(listingcontroller.editlisting)) 
    

module.exports= router;