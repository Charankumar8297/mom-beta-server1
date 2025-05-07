const express = require("express");
const router = express.Router();
const { addSuggestion, getSuggestions } = require("../controllers/suggestionController");

router.post("/add", addSuggestion);
router.get("/sug", getSuggestions);

module.exports = router;
