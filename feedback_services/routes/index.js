const express = require("express");
const router = express.Router();
const FeedbackService = require("../services/FeedbackService");
const sendAndConsume = require("../communication/rpc_client");



module.exports = () => {
    
    router.get("/", async (req, res, next) => {
        try {
            const feedbackService = new FeedbackService();    
            const artistsResponse = await sendAndConsume("GETNAMES"); 
            const artists = artistsResponse === "timeout" ? [] : artistsResponse;

            const feedbacks = await feedbackService.getList();

            res.render("layout", {
                template: "feedback",
                siteName: "Art Gallery",
                artistNames: artists,
                feedbacks: feedbacks
            });
            

            
        }catch(err) {
            return next(err);
        }            
    });

    router.post("/", async (req, res) => {
        try {
            const feedbackService = new FeedbackService();
            await feedbackService.addEntry(req.body.name, req.body.email, req.body.title, req.body.message);
            res.redirect("/feedback");
        }catch(err) {
            return next(err);
        }
        
    });

    return router;
}