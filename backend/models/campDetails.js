const mongoose = require('mongoose');

const CampDetailsSchema = new mongoose.Schema({
  unitNumber: {
    type: String,
    required: true
  },
  campSiteName: {
    type: String,
    required: true
  },
  numberOfDays: {
    type: Number,
    required: true
  },
  campSchedule: [
    {
      day: {
        type: String,
        required: true
      },
      events: [
        {
          date: {
            type: String,
            required: true
          },
          time: {
            type: String,
            required: true
          },
          eventName: {
            type: String,
            required: true
          },
          content: {
            type: String,
            required: true
          }
        }
      ]
    }
  ]
});

const CampDetails = mongoose.model('CampDetails', CampDetailsSchema,"Camp_Details");


module.exports = CampDetails;
