const express = require("express");
const router = express.Router();
const Client = require("../communication/rpc_client");


module.exports = (connection) => {
    router.get("/", async (req, res, next) => {
        try {
            const client = new Client(connection);

            const namesResponse = await client.sendAndConsume("GETNAMES");
            const artistsResponse = await client.sendAndConsume("GETLISTSHORT");
            const artworksResponse = await client.sendAndConsume("GETALLARTWORK");
            const names = namesResponse === "timeout" ? [] : namesResponse;
            const artists = artistsResponse === "timeout" ? [] : artistsResponse;
            const artworks = artworksResponse === "timeout" ? [] : artworksResponse;

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