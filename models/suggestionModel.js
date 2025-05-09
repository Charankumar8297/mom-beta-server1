const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    suggestion: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
     
});

module.exports = mongoose.model("Suggestion", suggestionSchema);
