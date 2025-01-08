if(process.env.NODE_ENV !="production"){
  require('dotenv').config();


}




const express = require("express");
const  app = express();
const mongoose = require("mongoose")
const path =require("path");
const e = require("express");
const methodOverride =require("method-override");
const ejsMate = require("ejs-mate")
const ExpressError = require("./utils/expresserror.js")
const wrapAsync = require('./utils/wrapasync.js');
const expression = require("express-session")
const MongoStore = require('connect-mongo');

const listingsrouter = require("./routes/listing.js");
const reviewrouter = require("./routes/review.js");
const userrouter= require("./routes/user.js");

const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const localstrategy = require("passport-local");
const User = require("./models/user.js");

const dburl=process.env.ATLASDB_URL




main().then(()=>{
    console.log("connected to DB")
}).catch((err)=>{
    console.log(err)
})
async function main() {
    await mongoose.connect(dburl)
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"))
app.use(express.urlencoded({extended:true}))
app.use(methodOverride("_method"))
app.engine("ejs",ejsMate)
app.use(express.static(path.join(__dirname,"public")))


const store=MongoStore.create({
  mongoUrl:dburl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600,
})
store.on("error",(err)=>{
  console.log("error in mongo session store",err)
})

const sessionOptions = ({
  store,
  secret:process.env.SECRET,
  resave:false,
  saveUnintialized:true,
  cookie:{
    expires:Date.now()+7*24*60*60*1000,
    maxAge:7*24*60*60*1000,
    httpOnly:true,
  }
});




app.use(session(sessionOptions));
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new localstrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req,res,next)=>{
  res.locals.successmsg= req.flash("success");
  res.locals.errormsg=req.flash("error")
  res.locals.curruser= req.user
  // console.log(res.locals.successmsg)
  next();
})
// app.get("/demouser",async(req,res)=>{
// let fakeuser= new User({
//   email:"abc@gmail.com",
//   username:"delta-student"
// });

//  let registereduser=await User.register(fakeuser,"helloworld")
// console.log(registereduser)
// res.send(registereduser)
// });
app.use("/listings",listingsrouter)
app.use("/listings/:id/review",reviewrouter)
app.use("/",userrouter)



// app.all("*",(req,res,next)=>{
//   next(new ExpressError(404,"Page not found!!"))
// })
// app.use((err,req,res,next)=>{
//   let {statuscode=500,message="something went wrong"}= err;
//   res.status(statuscode).render("listings/error.ejs",{err})
// //  res.status(statuscode).send(message)
// })
  







app.listen(8080,()=>{
    console.log("server is listinig to port 8080");
});