const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
    medicineAdd,
    getAllMedicines,
    getMedicineById,
    updateMedicine,
    deleteMedicine
} = require('../controllers/medicineController');

router.post("/add", upload.single('imageUrl'), medicineAdd);
router.get("/all", getAllMedicines);
router.get("/:id", getMedicineById);
router.put("/:id", upload.single('imageUrl'), updateMedicine);
router.delete("/:id", deleteMedicine);

module.exports = router;


