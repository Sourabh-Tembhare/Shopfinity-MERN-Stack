const mongoose = require("mongoose");
require("dotenv").config();

const dbConnect = () => {
  mongoose
    .connect(process.env.DATABASE_URL)
    .then(() => console.log("DB CONNECTED SUCCESSFULLY"))
    .catch((e) => {
      console.log(e);
      console.log("Error in DB connection");
    });
};

module.exports = dbConnect;
