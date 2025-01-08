const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync =  require("../utils/wrapasync.js")
const ExpressError = require("../utils/expresserror.js")

const Review=require("../models/review.js")
const Listing=require("../models/listing.js")
const{validateReview, isLoggedin,reviewauthor}=require("../middlewear.js")
const reviewcontroller = require("../controllers/review.js")
//reviews post route
router.post("/",
  isLoggedin,
  validateReview,
  wrapAsync(reviewcontroller.createreview))
//delete review
router.delete("/:reviewId",
  isLoggedin,
  reviewauthor,
  wrapAsync(reviewcontroller.deletereview))
module.exports= router