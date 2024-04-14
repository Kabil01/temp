const mongoose = require("mongoose");

// Define the schema for your "ImageDetails" model
const ImageDetailsSchema = new mongoose.Schema(
    {
        image: String,
        title: String,
        date: Date,
        content: String,
        priority: { type: Number, default: 1 }
    },
    {
        collection: "ImageDetails"
    }
);

// Create a Mongoose model using the schema
const ImageDetails = mongoose.model("ImageDetails", ImageDetailsSchema);

module.exports = ImageDetails; // Export the model to use it in other files
