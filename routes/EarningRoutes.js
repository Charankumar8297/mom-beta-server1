const express = require("express")
const { createEarning, getEarningByAgentId, getAllEarnings, getPendingByAgentId, completedEarningsByAgentId, dateRangeEarningsByAgentId, updateEarningById } = require("../controllers/EarningController")
const { get } = require("mongoose")
const Earnings = require("../models/Earning")


const router = express.Router()

//create order earning 
router.post("/create/:agentId", createEarning)

//get earning by agent id 
router.get("/getEarnings/:agentId", getEarningByAgentId)

//get all earnings
router.get('/' ,getAllEarnings)

//update earning by id
router.put('/update/:agentId' , updateEarningById)



//delete earning by id

//fetch pending earnings
router.get('/status/:status' , getPendingByAgentId)


//fetch completed earnings
// router.get('/completed', completedEarningsByAgentId);


//fetch cancelled earnings

//fetch earnings by date range by agent id
router.get('/dateRange/:date', dateRangeEarningsByAgentId);


module.exports = router 