const mongoose = require('mongoose');

const addressSchema = mongoose.Schema({
    userid: {
        type: String,
        required: [true, "please add the userid"],
    },

    state: {
        type: String,
        required: [true, "please add the state"],
    },

    city: {
        type: String,
        required: [true, "please add the city"],
    },

    street: {
        type: String,
        required: [true, "please add the street"],
    },

    pincode: {
        type: Number,
        required: [true, "please add the pincode"],
    },

    currentLocation: {
        lattitude: {
            type: Number,
            required: false
        },
        logitude: {
            type: Number,
            required: false
        }
    },

   
}, {
    timestamps: true,
});

module.exports = mongoose.model("Addres", addressSchema);
