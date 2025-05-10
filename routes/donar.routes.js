const express = require('express');
const donarControllers=require("../controllers/donar.controllers");
const router = express.Router();

router.post('/register',donarControllers.createDonar);
router.put('/edit/:id',donarControllers.editDonar);
router.get('/donar',donarControllers.getDonar);
router.delete('/delete/:id',donarControllers.deleteDonar);
module.exports = router;