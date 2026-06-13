const express = require("express");
const router = express.Router();

router.post("/idea", async (req, res) => {
    const { idea } = req.body;

    return res.json({
        status: "received",
        idea,
        message: "Idea sent to AI Orchestrator (next step)"
    });
});

module.exports = router;