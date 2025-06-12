const Donar = require('../models/donar.models');
const jwt = require("jsonwebtoken"); 

const createDonar = async (req, res) => {
    try {
        const { name, bloodGroup, dob, phone, email, country, state, district, city, pincode, availability } = req.body;

        if (!name || !bloodGroup || !dob || !phone || !email || !state || !district || !city || !pincode) {
            return res.status(400).json({ message: 'Please fill all the details' });
        }

        const existDonor = await Donar.findOne({ phone });
        if (existDonor) {
            return res.status(400).json({ message: 'Phone number already exists' });
        }

        const newDonar = new Donar({
            name,
            bloodGroup,
            dob,
            phone,
            email,
            country,
            state,
            district,
            city,
            pincode,
            availability: availability || false
        });

        await newDonar.save();
        res.status(200).json({ message: 'Donor registered successfully' });
    } catch (error) {
        console.error("Error creating donor:", error);
        res.status(500).json({ message: 'Something went wrong' });
    }
};
const editDonar = async (req, res) => {
    try {
        const { name, bloodGroup, dob, phone, email, country, state, district, city, pincode, availability } = req.body;
        const { id } = req.params;

        const updatedDonar = await Donar.findByIdAndUpdate(
            id,
            {
                name,
                bloodGroup,
                dob,
                phone,
                email,
                country,
                state,
                district,
                city,
                pincode,
                availability
            },
            { new: true }
        );

        if (!updatedDonar) {
            return res.status(404).json({ message: "Donor not found" });
        }

        res.status(200).json({ message: "Donor updated successfully!", donar: updatedDonar });
    } catch (error) {
        console.error("Error updating donor:", error);
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

const getDonar = async (req, res) => {
    try {
        const { state, district, city, bloodGroup } = req.query;
        const filter = {};

        if (state && state.trim() !== "") filter.state = state.trim();
        if (district && district.trim() !== "") filter.district = district.trim();
        if (city && city.trim() !== "") filter.city = city.trim();
        if (bloodGroup && bloodGroup.trim() !== "") filter.bloodGroup = bloodGroup.trim();

        const donors = await Donar.find(filter);

        if (!donors.length) {
            return res.status(404).json({ message: "No donors found for the selected criteria." });
        }

        res.status(200).json(donors);
    } catch (error) {
        console.error("Error fetching donor:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};






const deleteDonar = async (req, res) => {
    const { id } = req.params;
    console.log("Deleting Donor with ID:", id);
    try {
        const deletedDonar = await Donar.findByIdAndDelete(id);
        if (!deletedDonar) {
            return res.status(404).json({ message: "Donor not found" });
        }
        res.status(200).json({ message: "Donor successfully deleted", deletedDonar });
    } catch (error) {
        console.error("Delete error:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

module.exports = { createDonar, editDonar, getDonar, deleteDonar };