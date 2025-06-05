const express = require("express")
const { createEarning, getEarningByAgentId, getAllEarnings, getPendingByAgentId, completedEarningsByAgentId, dateRangePayoutByAgentId, dateRangeEarningsByAgentId, updateEarningById } = require("../controllers/EarningController")
const { get } = require("mongoose")
const Earnings = require("../models/Earning")
const deliveryBoyAuth = require("../middlewares/deliveryBoyAuth")


const router = express.Router()

//create order earning 
router.post("/create",deliveryBoyAuth, createEarning)

//get earning by agent id 
router.get("/getEarnings",deliveryBoyAuth , getEarningByAgentId)

//get all earnings
router.get('/' ,getAllEarnings)

//update earning by id
router.put('/update', deliveryBoyAuth , updateEarningById)



//delete earning by id

//fetch pending earnings
router.get('/status/:status', deliveryBoyAuth , getPendingByAgentId)


//fetch completed earnings
// router.get('/completed', completedEarningsByAgentId);


//fetch cancelled earnings

//fetch earnings by date range by agent id
router.get('/dateRange/:date',deliveryBoyAuth ,  dateRangeEarningsByAgentId);
router.get('/dateRangepayout/:date',deliveryBoyAuth ,  dateRangePayoutByAgentId);


module.exports = router 