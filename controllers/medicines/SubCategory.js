
const Category = require("../../models/medicines/Category.model");
const SubCategory=require("../../models/medicines/SubCategory.model");
const medicineindetail=require("../../models/medicines/Productdetail.model.")
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

cloudinary.config({
  cloud_name: 'dyoxjrqoe',
  api_key: '613928653291167',
  api_secret: 'r6wyYtddmhlsXnXzfn0RTddQEMA'
});

const createSubCategory = async (req, res) => {
  console.log("Request body:", req.body);
  try {
    const { subcategory_name, category, medicines, imageUrl } = req.body;
    const file = req.files?.imageUrl;
    if (!file) {
      return res.status(400).json({ message: "Image file is required." });
    }

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    const result = await cloudinary.uploader.upload(file.tempFilePath);
    console.log("Cloudinary upload result:", result);
    console.log("Request body insidee:", req.body);
    const subcategory = new SubCategory({
      subcategory_name,
      category,
      medicines,
      imageUrl: result.secure_url,
    });
    console.log("Request body insidee affter:", req.body);
    await subcategory.save();
    console.log("Request body insidee affter saved:", req.body);

    existingCategory.subcategories.push(subcategory._id);
    await existingCategory.save();

    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



const getAllSubcategories = async (req, res) => {
  try {
    const category = await Category.findById(req.params.category_id).populate({
      path: 'subcategories',
      populate: { path: 'medicines' }
    });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category.subcategories); 
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate('medicines').populate('category');
    res.status(200).json(subcategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getSubCategoryById = async (req, res) => {
  try {
    const subcategory = await SubCategory.findById(req.params.subcategory_id).populate('medicines');
    if (!subcategory) return res.status(404).json({ message: "SubCategory not found" });
    res.status(200).json(subcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const updateSubCategory = async (req, res) => {
  try {
    const updates = { ...req.body };
    if (req.files?.imageUrl) {
      const result = await cloudinary.uploader.upload(req.files.imageUrl.tempFilePath);
      updates.imageUrl = result.secure_url;
    }
    const subcategory = await SubCategory.findByIdAndUpdate(req.params.subcategory_id, updates, { new: true });
    res.status(200).json(subcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const deleteSubCategory = async (req, res) => {
  try {
    await SubCategory.findByIdAndDelete(req.params.subcategory_id);
    res.status(200).json({ message: "SubCategory deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createSubCategory,
  getAllSubcategories,
  getSubCategories,
  getSubCategoryById,
  updateSubCategory,
  deleteSubCategory
};
