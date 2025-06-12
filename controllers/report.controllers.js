const Report = require('../models/report.models');
const Donar = require('../models/donar.models');

// Create report with userId and donor reference
const getuserId = async (req, res) => {
  try {
    const { userId, report, Donar: donorId } = req.body;

    const newReport = new Report({
      userId,
      report,
      Donar: donorId,
    });

    await newReport.save();
    res.status(201).json(newReport);
  } catch (error) {
    console.error("Error in getuserId:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create report (simpler version)
const createreport = async (req, res) => {
  try {
    const { report, Donar: donorId } = req.body;

    const newReport = new Report({
      report,
      Donar: donorId,
    });

    await newReport.save();
    res.status(201).json({ newReport });
  } catch (error) {
    console.error("Error in createreport:", error);
    res.status(500).json({ message: 'Server error' });
  }
};


const getreport = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({
        path: 'Donar',
        select: 'name bloodGroup dob phone email country state district city pincode availability'
      });

    res.status(200).json(reports);
  } catch (error) {
    console.error("Error in getreport:", error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getuserId, createreport,getreport};