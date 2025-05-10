const Medicine = require("../../models/medicines/Productdetail.model.");
const SubCategory = require("../../models/medicines/SubCategory.model");
const fs = require('fs');
const path = require('path');
const createMedicine = async (req, res) => {
  try {
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const {
      medicine_name,price,prescriptionDrug,description,use,ingredients,dose,manufacturer,notFor,store,expiryDate,
      manufactureDate,
      subCategory, 
    } = req.body;

    if (!medicine_name || !price || !description || !expiryDate || !subCategory) {
      return res.status(400).json({ message: "Required fields are missing." });
    }
    const existingSubCategory = await SubCategory.findById(subCategory);
    if (!existingSubCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    const newMedicine = new Medicine({
      medicine_name,price,prescriptionDrug,description,use,ingredients,dose,manufacturer,notFor,store,expiryDate,
      manufactureDate,
      subcategories: [subCategory], 
      imageUrl,
    });

    await newMedicine.save();

    existingSubCategory.medicines.push(newMedicine._id);
    await existingSubCategory.save();

    res.status(201).json({ message: "Medicine added successfully", data: newMedicine });
  } catch (error) {
    res.status(500).json({ message: "Error adding medicine", error: error.message });
  }
};

const getMedicines = async (req, res) => {
  try {
    const medicines = await Medicine.find().populate('subcategories');
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMedicineById = async (req, res) => {
  try {
    const medicine = await Medicine.findById(req.params.medicine_id);
    if (!medicine) return res.status(404).json({ message: "Medicine not found" });
    res.status(200).json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateMedicine = async (req, res) => {
  try {
    const medicine = await Medicine.findByIdAndUpdate(req.params.medicine_id, req.body, { new: true }).populate('subcategories');
    res.status(200).json(medicine);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteMedicine = async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.medicine_id);
    res.status(200).json({ message: "Medicine deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getMedicinesBySubCategory = async (req, res) => {
  try {
    const subcategoryId = req.params.subcategory_id;
    const medicines = await Medicine.find({ subcategory: subcategoryId }).populate('subcategories');
    
    if (medicines.length === 0) {
      return res.status(404).json({ message: 'No medicines found for this subcategory.' });
    }
    
    res.status(200).json(medicines);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
module.exports = {
  createMedicine,
  getMedicines,
  getMedicineById,
  updateMedicine,
  deleteMedicine,
  getMedicinesBySubCategory,
};
