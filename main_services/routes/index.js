const express = require("express");
const router = express.Router();
const Client = require("../communication/rpc_client");


module.exports = () => {
    router.get("/", async (req, res, next) => {
        try {
            const client = new Client();
            const {channel, connection} = await client.connect();

            await client.send("GETNAMES" ,channel);
            await client.send("GETLISTSHORT" ,channel);
            await client.send("GETALLARTWORK" ,channel);

            const namesResponse = await client.consume("GETNAMES", channel);
            const artistsResponse = await client.consume("GETLISTSHORT", channel);
            const artworksResponse = await client.consume("GETALLARTWORK", channel);
            const names = namesResponse === "timeout" ? [] : namesResponse;
            const artists = artistsResponse === "timeout" ? [] : artistsResponse;
            const artworks = artworksResponse === "timeout" ? [] : artworksResponse;
            client.disconnect(connection);

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