const express = require("express");
const app = express();
require("dotenv").config();
const dbConnect = require("./config/database");
const userRoute = require("./routes/user");
const vendorProfile = require("./routes/vendorProfile");
const categoryRoute = require("./routes/categoryRoute");
const productRoute = require("./routes/productRoute");
const orderPaymentRoute = require("./routes/orderPaymentRoute");
const reviewRoute = require("./routes/ReviewRoute");
const cors = require("cors");
const expressFileUpload = require("express-fileupload");


// find PORT 
const PORT = process.env.PORT ||  5000;

// parser
app.use(cors());
app.use(express.json());
app.use(expressFileUpload({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}))



// mount route
app.use("/api/v1",userRoute);
app.use("/api/v1",vendorProfile);
app.use("/api/v1",categoryRoute);
app.use("/api/v1",productRoute);
app.use("/api/v1",orderPaymentRoute)
app.use("/api/v1",reviewRoute);



// connection of database
dbConnect();




app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Welcome to the Shopfinity"
    });
});

// listen port
app.listen(PORT,()=>{
    console.log(`Server is successfully running at port no ${PORT}`);
    
});