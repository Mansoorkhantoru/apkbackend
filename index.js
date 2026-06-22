const express = require("express")
const app = express()
const App = require("./models/app")
const connected = require("./config/config")
const dotenv = require("dotenv")
dotenv.config()
connected()
const cors = require("cors")
app.use(express.json())
app.use(express.urlencoded({ extended: true })) 
const {upload , cloudinary } = require("./config/cloudinary")


app.use(cors({
    origin: "https://rad-sorbet-b2105e.netlify.app",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.post("/addapp" ,  upload.single('image'), async(req,res)=>{
    try{
const {title , details , link} = req.body;
        if(!title || !details){
            return res.json({
                success:false,
                message:"Please fill the require"
            })
        }
        if(!req.file){
            res.json({
                message:"Please upload an image"
            })
        }
        const res = await App.create({
            title , details, link , 
            image:req.file.path || req.file.secure_url
        })
        res.json({
            succes:true,
            message:"Save succefully",
            res 
        })

    }catch(error){
        res.json({
            succes:false,
            message:{error}
        })
    }
})  

app.get("/allapp", async(req,res)=>{
    try{
        const apps = await App.find({})
        res.json({success:true, apps})
    }catch(error){
        error.message
    }
})
app.get("/allapp/:id", async(req,res)=>{
    try{
        const appDetails = await App.findById(req.params.id)
        res.json(appDetails)
    }catch(error){
        res.json({
            success:false,
            message:"Error not opening app Details"
        })
    }
})
app.delete("/allapp/:id",async(req,res)=>{
    try{
        await App.findByIdAndDelete(req.params.id);
        res.json({
            success:true,
            message:"Content Deleted"
        })
    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message 
        })
    }
})
app.listen(3000)