const express = require('express');
const router = express.Router();
const reportController = require("../controllers/report.controllers");


router.post('/userIDdetails', reportController.getuserId);

router.post('/reportdetails', reportController.createreport);


router.get('/reports', reportController.getreport);

module.exports = router;