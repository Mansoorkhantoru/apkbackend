const mongoose = require("mongoose")

const connect = ()=>{
    try{
        const con = mongoose.connect(process.env.MONGO_URI)
        console.log("connected")
    }catch(error){
        console.error(error.message)
    }
}

module.exports = connect