const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');

const categoryController = require('../controllers/medicines/category');
const subcategoryController = require('../controllers/medicines/SubCategory');
const medicineController = require('../controllers/medicines/medicineController');

//ctegory routes
router.post('/categories', categoryController.createCategory);

router.get('/categories',   categoryController.getAllCategories);
router.get('/categories/:id',categoryController.getCategoryById);
router.put('/categories/:id',categoryController.updateCategory);
router.delete('/categories/:id',   categoryController.deleteCategory);


//subcategory routes
router.post('/subcategories', upload.single('imageUrl'), subcategoryController.createSubCategory);
router.get('/subcategories', subcategoryController.getSubCategories);
router.get('/subcategories/:subcategory_id', subcategoryController.getSubCategoryById);
router.put('/subcategories/:subcategory_id',upload.single('imageUrl'), subcategoryController.updateSubCategory);
router.delete('/subcategories/:subcategory_id', subcategoryController.deleteSubCategory);
router.get('/categories/:category_id/subcategories', subcategoryController.getAllSubcategories);

//mwdicine routes
router.post('/medicines',upload.single('imageUrl'),medicineController.createMedicine);
router.get('/medicines', medicineController.getMedicines);
router.get('/medicines/:medicine_id', medicineController.getMedicineById);
router.put('/medicines/:medicine_id',upload.single('imageUrl'), medicineController.updateMedicine);
router.delete('/medicines/:medicine_id', medicineController.deleteMedicine);
router.get('/subcategories/:subcategory_id/medicines', medicineController.getMedicinesBySubCategory);

module.exports = router;
