const mongoose = require("mongoose");

const suggestionSchema = new mongoose.Schema({
    userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    // required: true,
    },

        suggestionType: {
        type: String,
        enum: ['Product', 'Bug', 'Feature'], 
        // required: true
    },
    suggestion: {
        type: String,
        // required: true
    },
        isTechnical: {
        type: Boolean,
    },
        isNonTechincal: {
            type: Boolean,

    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    
});

module.exports = mongoose.model("Suggestion", suggestionSchema);