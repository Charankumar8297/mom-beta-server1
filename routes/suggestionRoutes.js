const express = require("express");
const router = express.Router();
const { addSuggestion, getSuggestions, updateSuggestionStatus } = require("../controllers/suggestionController");

router.post("/add", addSuggestion);
router.get("/sug", getSuggestions);
router.put('/update-status/:id', updateSuggestionStatus);
module.exports = router;