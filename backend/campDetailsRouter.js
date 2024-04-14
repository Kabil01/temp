const express = require('express');
const router = express.Router();
const CampDetailsModel = require('./models/campDetails'); // Your model file

// POST route to insert camp details
router.post("/insertCampDetails", async (req, res) => {
    try {
        const formData = req.body;

        // Ensure that the required fields are present in the formData
        if (!formData.unitNumber || !formData.campSiteName || !formData.numberOfDays || !formData.campSchedule) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Create a new instance of CampDetailsModel with the provided form data
        const campDetails = new CampDetailsModel(formData);

        // Save the new camp details to the database
        await campDetails.save();

        // Send a success response
        res.status(200).json({ message: "Camp details inserted successfully", data: campDetails });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
