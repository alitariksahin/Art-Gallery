const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
app.use(cors());
const mongoose = require("mongoose");
require("dotenv").config();

mongoose.set("strictQuery", false);
const connectDB = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI);
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
      console.log(error);
      process.exit(1);
    }
  }
const errorHandler = require("./middlewares/error");

const port = 3003;
const mainRouter = require("./routes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, "/static")));


app.use("/", mainRouter());
app.use(errorHandler);


connectDB().then(() => {
    app.listen(process.env.PORT || port, () => {
        console.log(`listening on port ${process.env.PORT || port}`);
    });
});