const express = require("express");
const router = express.Router();

module.exports = (artistService) => {
    
    router.get("/", async (req, res, next) => {
        try {
            res.render("layout", {
                template: "artists",
                siteName: "Art Gallery",
                artistNames : (await artistService.getNames()),
                artists: (await artistService.getList()),
                artworks: (await artistService.getAllArtwork())
            });
        }catch(err) {
            return next(err);
        }
        
    });

    router.get("/artists/:shortname", async (req, res, next) => {
        try {
            res.render("layout", {
                template: "artist-detail",
                siteName: "Art Gallery",
                artistNames : (await artistService.getNames()),
                artistNames: (await artistService.getNames()),
                artist: (await artistService.getArtist(req.params.shortname)),
                artworks: (await artistService.getArtworkForArtist(req.params.shortname))
            });
        }catch(err) {
            return next(err);
        }
        
    }); 

    router.get("/:shortname", async (req, res, next) => {
        try {
            res.render("layout", {
                template: "artist-detail",
                siteName: "Art Gallery",
                artistNames : (await artistService.getNames()),
                artistNames: (await artistService.getNames()),
                artist: (await artistService.getArtist(req.params.shortname)),
                artworks: (await artistService.getArtworkForArtist(req.params.shortname))
            });
        }catch(err) {
            return next(err);
        }
        
    }); 



    return router;
}