const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    rollNumber: String,
    name: String,
    dept: String,
    academicYearFrom: String,
    academicYearTo: String
});

const odRegistrationSchema = new mongoose.Schema({
    unitNumber: Number,
    eventName: String,
    fromDate: Date,
    toDate: Date,
    reason: String,
    studentsList: [studentSchema] // Define an array of nested objects to store student details
});

const odRegistration = mongoose.model("odRegistration", odRegistrationSchema);

module.exports = odRegistration;
