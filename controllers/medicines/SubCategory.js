
const Category = require("../../models/medicines/Category.model");
const SubCategory=require("../../models/medicines/SubCategory.model");
const medicineindetail=require("../../models/medicines/Productdetail.model.")
const fs = require('fs');
const path = require('path');

const createSubCategory = async (req, res) => {
  try {
    const { subcategory_name, category, medicines } = req.body;
    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const existingCategory = await Category.findById(category);
    if (!existingCategory) {
      return res.status(404).json({ message: "Category not found" });
    }
    const subcategory = new SubCategory({
      subcategory_name,
      category,
      medicines,
      imageUrl,
    });

    await subcategory.save();

    existingCategory.subcategories.push(subcategory._id);
    await existingCategory.save(); 
    
    res.status(201).json(subcategory);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllSubcategories = async (req, res) => {
  try {
    const category = await Category.findById(req.params.category_id).populate('medicines');
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category.subCategories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
const getSubCategories = async (req, res) => {
  try {
    const subcategories = await SubCategory.find().populate('medicines');
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
    const subcategory = await SubCategory.findByIdAndUpdate(req.params.subcategory_id, req.body, { new: true });
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
