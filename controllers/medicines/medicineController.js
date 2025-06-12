const Medicine = require("../../models/medicines/Productdetail.model.");
const SubCategory = require("../../models/medicines/SubCategory.model");
const fs = require('fs');
const path = require('path');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dyoxjrqoe',
  api_key: '613928653291167',
  api_secret: 'r6wyYtddmhlsXnXzfn0RTddQEMA'
});

const createMedicine = async (req, res) => {
  try {
    const {
      medicine_name,price,prescriptionDrug,description,use,ingredients,dose,manufacturer,notFor,store,expiryDate,imageUrl,
      manufactureDate,
      subCategory, 
    } = req.body;

    const file = req.files?.imageUrl;
    if (!file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    if (!medicine_name || !price || !description || !expiryDate || !subCategory) {
      return res.status(400).json({ message: "Required fields are missing." });
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath);
    console.log("Cloudinary upload result:", result);
    
    const existingSubCategory = await SubCategory.findById(subCategory);
    if (!existingSubCategory) {
      return res.status(404).json({ message: "Subcategory not found" });
    }
    const newMedicine = new Medicine({
      medicine_name,price,prescriptionDrug,description,use,ingredients,dose,manufacturer,notFor,store,expiryDate,
      manufactureDate,
      subcategories: [subCategory], 
      imageUrl: result.secure_url,
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
    const medicines = await Medicine.find().populate('subcategories._Id');
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

    const updates = { ...req.body };
     if (req.files?.imageUrl) {
      const result = await cloudinary.uploader.upload(req.files.imageUrl.tempFilePath);
      updates.imageUrl = result.secure_url;
    }
    const medicine = await Medicine.findByIdAndUpdate(req.params.medicine_id, updates, { new: true }).populate('subcategories');
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
    const medicines = await Medicine.find({ subcategories: subcategoryId });
    
   
    
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
