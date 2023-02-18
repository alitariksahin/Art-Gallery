const express = require("express");
const router = express.Router();
const sendAndConsume = require("../communication/rpc_client");
const amqplib = require("amqplib");

module.exports = () => {
    router.get("/", async (req, res, next) => {
        try {
            const connection = await amqplib.connect(process.env.RABBITMQ_URL)
            const channel = await connection.createChannel();

            const responses = await sendAndConsume(["GETNAMES", "GETLISTSHORT", "GETALLARTWORK"] , channel);
            const names = responses === "timeout" ? [] : responses["GETNAMES"];
            const artists = responses === "timeout" ? [] : responses["GETLISTSHORT"];
            const artworks = responses === "timeout" ? [] : responses["GETALLARTWORK"];

            connection.close();
            res.render("layout", {
                template: "home",
                siteName: "Art Gallery",
                artistNames: names,
                topArtists: artists,
                artworks: artworks
            });
            

            
        }catch(err) {
            return next(err);
            
        }      
    });

    return router;
}