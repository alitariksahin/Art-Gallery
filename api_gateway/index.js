const express = require("express");
const proxy = require("express-http-proxy");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());

const port = 3000;

app.use(express.json());
app.use(express.urlencoded({extended:false}));

app.get("/health", async (req, res)=> {
    res.status(200).json({msg: "api_gateway is up and running."});
})

app.use("/artists", proxy(process.env.ARTISTS_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
      next(err);
  }}));
app.use("/feedback", proxy(process.env.FEEDBACK_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
      next(err);
  }}));
app.use("/", proxy(process.env.MAIN_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
      next(err);
  }}));

app.use((err, req, res, next) => {
    res.set('Content-Type', 'text/html');
    console.log(err);
    switch(err.code) {
        case 'ECONNREFUSED': { return res.status(200).send(Buffer.from(
            `<h1 style="text-align:center">Seems like the server on port ${err.port} is down.</h2><br>
            <h2 style="text-align:center"><a href="/">Try Main Service</a></h2><br>
            <h2 style="text-align:center"><a href="/feedback">Try Feedback Service</a></h2><br>
            <h2 style="text-align:center"><a href="/artists">Try Artists Service</a></h2>`
            )); }
        case 'ECONNRESET': {return res.status(200).redirect("/");}
    }
})



app.listen(process.env.PORT || port, () => {
    console.log(`listening on port ${process.env.PORT || port}`);
    //* To make sure the services will be open
    setInterval(async ()=> {
        try {
            await axios.get(process.env.URL.concat("/health"));
            await axios.get(process.env.URL);
        }catch(err) {
        }
        
    },180000);
})