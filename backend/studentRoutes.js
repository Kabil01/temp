const express = require("express");
const router = express.Router();
const ChannelModel = require("./models/channel");

router.post("/insert", async (req, res) => {
    try {
        const { roll_number, name, nss_unit_number, from_year, to_year, contact_number, email, dateofbirth, blood_group, } = req.body;

        const channelModel = new ChannelModel({
            roll_number,
            name,
            nss_unit_number,
            from_year,
            to_year,
            contact_number,
            email,
            dateofbirth,
            blood_group,
        });

        await channelModel.save();
        res.status(200).send({ "msg": "Inserted to db" });
    } catch (error) {
        console.error(error);
        res.status(500).send({ "error": "Internal Server Error" });
    }
});

router.get("/get/:id", async (req, res) => {
    try {
        const student = await ChannelModel.findById(req.params.id);
        if (!student) {
            return res.status(404).json({ error: "Student not found" });
        }
        return res.status(200).json(student);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/read", async (req, res) => {
    try {
        const data = await ChannelModel.find();
        
        return res.status(200).send(data);
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
});

router.post("/update", async (req, res) => {
    try {
        const { id, ...updateFields } = req.body;

        // Check if ID is provided
        if (!id) {
            return res.status(400).json({ error: "ID parameter is missing" });
        }

        // Check if student with provided ID exists
        const existingStudent = await ChannelModel.findById(id);
        if (!existingStudent) {
            return res.status(404).json({ error: "Student not found" });
        }

        // Update student record fields
        Object.assign(existingStudent, updateFields);

        // Save updated student record
        await existingStudent.save();

        // Send response indicating successful update
        return res.status(200).json({ message: "Student details updated successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/delete/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const deletedStudent = await ChannelModel.findByIdAndDelete(id);

        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found" });
        }

        return res.status(200).json({ message: "Student deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

module.exports = router;
