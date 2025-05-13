const Suggestion = require("../models/suggestionModel");

exports.addSuggestion = async (req, res) => {
    try {
        const { userId, suggestion ,suggestionType, isTechnical, isNonTechincal} = req.body;
        // if (!userId || !suggestion || !isTechnical || !isNonTechincal) {
        //     return res.status(400).json({ message: "userId and suggestion are required" });
        // }
        const newSuggestion = new Suggestion({ userId, suggestion, suggestionType, isTechnical, isNonTechincal });
        await newSuggestion.save();

        res.status(201).json({
            message: "Suggestion added successfully",
            data: newSuggestion
        });

    } catch (error) {
        res.status(500).json({
            message: "Error adding suggestion",
            error: error.message
        });
    }
};


exports.getSuggestions = async (req, res) => {
    try {
        const suggestions = await Suggestion.find().sort({ createdAt: -1 });
        res.status(200).json(suggestions);
    } catch (error) {
        res.status(500).json({
            message: "Error fetching suggestions",
            error: error.message
        });
    }
};