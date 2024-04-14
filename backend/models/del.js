const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
    dateTime: {
        date: {
            type: Date,
            required: true
        },
        timeZone: {
            type: String,
            required: true,
            trim: true
        }
    },
    event: {
        type: String,
        required: true,
        trim: true
    }
});

const campDaySchema = new mongoose.Schema({
    day: {
        type: Number,
        required: true
    },
    events: [eventSchema]
});

const campDetailsSchema = new mongoose.Schema({
    unitNumber: {
        type: Number,
        required: true
    },
    campSiteName: {
        type: String,
        required: true,
        trim: true
    },
    numberOfDays: {
        type: Number,
        required: true
    },
    campSchedule: [campDaySchema],
    // participants: [
    //     {
    //         studentID: {
    //             type: mongoose.Schema.Types.ObjectId,
    //             ref: "Channel"  // Assuming the model for student details is named "Channel"
    //         },
    //         name: {
    //             type: String,
    //             required: true,
    //             trim: true
    //         },
    //         role: {
    //             type: String,
    //             required: true,
    //             trim: true
    //         }
    //     }
    // ],
    // poDetails: {
    //     name: {
    //         type: String,
    //         required: true,
    //         trim: true
    //     },
    //     contact: {
    //         type: String,
    //         trim: true
    //     }
    // }
});

const CampDetailsModel = mongoose.model("CampDetails", campDetailsSchema, "Camp_Details");

module.exports = CampDetailsModel;
