const express = require("express");
const path = require("path");
const app = express();
const cors = require("cors");
app.use(cors());
require("dotenv").config();

const port = 3001;

const errorHandler = require("./middlewares/error");
const mainRouter = require("./routes");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.urlencoded({extended:false}));
app.use(express.static(path.join(__dirname, "/static")));


app.use("/", mainRouter());


app.use(errorHandler);


app.listen(process.env.PORT || port, () => {
    console.log(`listening on port ${process.env.PORT || port}`);
});