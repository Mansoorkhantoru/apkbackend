const mongoose = require("mongoose")

const userSchme = mongoose.Schema({
    title:{
        type:String 
    },
    details:{
        type:String,
        required:true 
    },
    image:{
        type:String
    },
    link:{
        type:String,
        required:true
    }
})


module.exports = mongoose.model("Apps" , userSchme)