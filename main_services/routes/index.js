const express = require("express");
const router = express.Router();
const sendAndConsume = require("../communication/rpc_client");


module.exports = () => {
    router.get("/", async (req, res, next) => {
        try {
            const namesResponse = await sendAndConsume("GETNAMES");
            const artistsResponse = await sendAndConsume("GETLISTSHORT");
            const artworksResponse = await sendAndConsume("GETALLARTWORK");
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