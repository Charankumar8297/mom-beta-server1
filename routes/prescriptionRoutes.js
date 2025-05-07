const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {addPrescription,deletePrescription,getPrescriptionById,getAllPrescriptions} = require('../controllers/prescriptionController');

router.post('/add-pre', upload.single('image'), addPrescription);            
router.delete('/:id', deletePrescription);                            
router.get('/:id', getPrescriptionById);                              
router.get('/allpre', getAllPrescriptions);                                 

module.exports = router;
