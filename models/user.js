
const mongoose = require("mongoose");
const Schema= mongoose.Schema
const passportlocalMongoose = require("passport-local-mongoose")

const userschema = new Schema({
    email:{
        type:String,
        required:true
    }, 
});
userschema.plugin(passportlocalMongoose);

module.exports = mongoose.model('User', userschema);
