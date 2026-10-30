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
const { upload, cloudinary } = require("./config/cloudinary")

// CORS setup (Localhost aur Netlify dono ke liye)
app.use(cors({
    origin: [  "https://apknu.com",
        "https://www.apknu.com","https://rad-sorbet-b2105e.netlify.app", "http://localhost:3000", "http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.post("/addapp", upload.single('image'), async (req, res) => {
    try {
        const { title, details, link } = req.body;
        
        if (!title || !details) {
            return res.json({
                success: false,
                message: "Please fill the required fields"
            });
        }
        
        if (!req.file) {
            return res.json({
                success: false,
                message: "Please upload an image"
            });
        }

        // Variable name 'res' ki jagah 'newApp' rakha hai taake Express response overwrite na ho
        const newApp = await App.create({
            title, 
            details, 
            link, 
            image: req.file.path || req.file.secure_url
        });

        res.json({
            success: true,
            message: "Saved successfully",
            app: newApp 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
}); 

app.get("/allapp", async (req, res) => {
    try {
        const apps = await App.find({});
        res.json({ success: true, apps });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get("/allapp/:id", async (req, res) => {
    try {
        const appDetails = await App.findById(req.params.id);
        res.json({ success: true, appDetails });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error opening app details"
        });
    }
});

app.delete("/allapp/:id", async (req, res) => {
    try {
        await App.findByIdAndDelete(req.params.id);
        res.json({
            success: true,
            message: "Content Deleted"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message 
        });
    }
});

const { SitemapStream, streamToPromise } = require('sitemap');

app.get('/sitemap.xml', async (req, res) => {
    try {
        res.header('Content-Type', 'application/xml');
        const smStream = new SitemapStream({ hostname: 'https://apknu.com' });

        smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });

        const apps = await App.find({});
        apps.forEach(item => {
            smStream.write({
                url: `/allapp/${item._id}`,
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: item.updatedAt || item.createdAt
            });
        });

        smStream.end();
        const sitemap = await streamToPromise(smStream);
        res.send(sitemap.toString());

    } catch (error) {
        console.error(error);
        res.status(500).end();
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));