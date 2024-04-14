const express = require("express");
const mongoose = require("mongoose");
const ChannelModel = require("./models/channel");
const cors = require("cors")
const { Packer } = require("docx");
const pdfKit = require('pdfkit');

const router = express.Router();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(cors({
    origin:'https://deploy-mern-lwhq.vercel.app',
    methods:["POST","GET","PUT","DELETE"],
    credentials: true
}));

const dbUrl = "mongodb+srv://testuser:testuser123@cluster0.s5o30e8.mongodb.net/NSS_Student_DB?retryWrites=true&w=majority&appName=Cluster0";
const connectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
};

mongoose.connect(dbUrl, connectionParams).then(() => {
    console.info("Connected to DB");
}).catch((e) => {
    console.log("Error:", e);
});

app.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}`);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.post("/insert", async (req, res) => {
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

app.get("/get/:id", async (req, res) => {
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


app.get("/read", async (req, res) => {
    try {
        const data = await ChannelModel.find();
        
        return res.status(200).send(data);
    } catch (err) {
        console.error(err);
        return res.status(500).send(err);
    }
});

// Update existing student data
app.post("/update", async (req, res) => {
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



// Delete student data

app.delete('/delete/:id', async (req, res) => {
  try {
    const deletedStudent = await ChannelModel.findByIdAndDelete(req.params.id);
    if (!deletedStudent) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.status(200).json({ msg: 'Student deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});





/* */


// Importing the ImageDetails model
const ImageDetails = require("./models/imageDetails");



//////////////////////////////

const multer = require('multer');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '../frontend/src/images/');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now();
        cb(null, uniqueSuffix + file.originalname);
    },
});

const upload = multer({ storage: storage });

// Define a route to handle POST requests for uploading images
app.post("/upload-image", upload.single("image"), async (req, res) => {
    const { title, date, content } = req.body; // Destructure title, date, and content from request body
    const imageName = req.file.filename;

    try {
        await ImageDetails.create({ image: imageName, title, date, content }); // Create new image details
        res.json({ status: "ok", imageName: imageName }); // Sending imageName as response
    } catch (error) {
        console.error("Error inserting image details:", error);
        res.status(500).json({ status: "error", message: "Failed to insert image details" });
    }
});

// Define a route to handle GET requests for fetching images
app.get("/get-image", async (req, res) => {
    try {
        const images = await ImageDetails.find().sort({ priority: -1 }); // Fetch images sorted by priority in ascending order
        res.json({ success: true, data: images });
    } catch (error) {
        console.error("Error fetching images:", error);
        res.status(500).json({ success: false, message: "Failed to fetch images" });
    }
});


// Define a route to handle PUT requests for prioritizing images
app.put("/prioritize-image/:id", async (req, res) => {
    const { id } = req.params;

    try {
        const image = await ImageDetails.findById(id);
        if (!image) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }
        
        // Increase the priority by 1
        image.priority = (image.priority || 0) + 1;
        
        // Save the updated image
        const updatedImage = await image.save();
        res.json({ success: true, data: updatedImage });
    } catch (error) {
        console.error("Error prioritizing image:", error);
        res.status(500).json({ success: false, message: "Failed to prioritize image" });
    }
});

app.put("/reduce-priority/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Find the image by ID in the database
        const image = await ImageDetails.findById(id);

        if (!image) {
            // If image with the provided ID does not exist, return a 404 Not Found response
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        // Decrement the priority by 1
        const updatedPriority = Math.max(image.priority - 1, 1); // Ensure priority is not less than 1

        // Update the image with the decremented priority
        image.priority = updatedPriority;
        await image.save();

        // Return the updated image data
        res.json({ success: true, data: image });
    } catch (error) {
        console.error("Error reducing priority:", error);
        res.status(500).json({ success: false, message: "Failed to reduce priority" });
    }
});


const fs = require('fs');
const path = require('path');

app.delete("/delete-image/:id", async (req, res) => {
    const { id } = req.params;

    try {
        // Find the image by ID
        const deletedImage = await ImageDetails.findByIdAndDelete(id);
        if (!deletedImage) {
            return res.status(404).json({ success: false, message: "Image not found" });
        }

        // Delete the image file from the ../frontend/src/images folder
        const imagePath = path.join(__dirname, '..', 'frontend', 'src', 'images', deletedImage.image);
        fs.unlinkSync(imagePath);

        // Return success response
        res.json({ success: true, message: "Image deleted successfully", data: deletedImage });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ success: false, message: "Failed to delete image" });
    }
});


const bodyParser = require('body-parser');

const CampDetailsModel = require('./models/campDetails'); // Your model file

// POST route to insert camp details
// Assuming you have required necessary modules and defined CampDetailsModel



const ODRegistration = require("./models/odRegistration");

app.post("/register", async (req, res) => {
    try {
        const { unitNumber, eventName, fromDate, toDate, reason, studentsList } = req.body;
        if (!unitNumber || !eventName || !fromDate || !toDate || !reason || !studentsList || studentsList.length === 0) {
            return res.status(400).json({ error: "Invalid request. Ensure all required fields are provided." });
        }
        const odRegistration = new ODRegistration({
            unitNumber,
            eventName,
            fromDate,
            toDate,
            reason,
            studentsList
        });
        await odRegistration.save();
        res.status(200).json({ message: "OD registered successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.get("/downloadODRegistrations", async (req, res) => {
    try {
        // Fetch OD registrations from the database
        const odRegistrations = await ODRegistration.find(); // Adjust query as needed
        console.log("Fetched OD registrations:", odRegistrations);

        // Send the data as JSON response
        res.json(odRegistrations);
    } catch (error) {
        console.error("Error fetching OD registrations:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


app.get('/downloadEvent/:eventId', async (req, res) => {
    try {
        // Fetch event data from the database based on eventId
        const event = await ODRegistration.findById(req.params.eventId);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        // Create a PDF document
        const doc = new pdfKit();
        const pdfFilePath = `EventDetails_${req.params.eventId}.pdf`;
        const pdfStream = fs.createWriteStream(pdfFilePath);
        doc.pipe(pdfStream);

        // Add event details to the PDF
        doc.fontSize(20).text('Event Details\n\n', { align: 'center' });
        doc.fontSize(12).text(`Unit Number: ${event.unitNumber}`);
        doc.text(`Event Name: ${event.eventName}`);
        doc.text(`From Date: ${event.fromDate}`);
        doc.text(`To Date: ${event.toDate}`);
        doc.text(`Reason: ${event.reason}`);
        doc.text('\nStudents List:');
        
        // Headers for the table
        let yPosition = doc.y + 15;
        doc.fontSize(10).text('S.No', 100, yPosition);
        doc.text('Roll Number', 150, yPosition);
        doc.text('Name', 250, yPosition);
        doc.text('Department', 380, yPosition);
        yPosition += 15; // Increment yPos after adding headers
        
        // Data rows for the table
        let serialNumber = 1;
        for (const student of event.studentsList) {
            // Check if yPos exceeds the page height
            if (yPosition + 50 > doc.page.height - 50) { // Adjust the buffer (50) as needed
                console.log('Adding new page');
                doc.addPage(); // Start a new page
                yPosition = 50; // Reset yPos to start from the top of the new page

                // Add headers for the new page
                doc.fontSize(10).text('S.No', 100, yPosition);
                doc.text('Roll Number', 150, yPosition);
                doc.text('Name', 250, yPosition);
                doc.text('Department', 380, yPosition);

                yPosition += 15; // Increment yPos after adding headers
            }

            // Add watermark to each page
            const watermarkX = (doc.page.width - 200) / 2;
            const watermarkY = (doc.page.height - 200) / 2;
            doc.image('./images/ceglogoopacity.png', watermarkX, watermarkY, { width: 200, height: 200, align: 'center', opacity: 0.1 });

            // Add data row to the table
            doc.fontSize(10).text(serialNumber.toString(), 100, yPosition);
            doc.text(student.rollNumber, 150, yPosition);
            doc.text(student.name, 250, yPosition);
            doc.text(student.dept, 380, yPosition);

            yPosition += 15; // Increment yPos for the next row
            serialNumber++;
        }

        // Finalize and close the PDF stream
        doc.end();
        pdfStream.on('finish', () => {
            // Send the PDF file as a downloadable attachment
            res.download(pdfFilePath, 'EventDetails.pdf', (err) => {
                if (err) {
                    console.error('Error sending PDF:', err);
                    res.status(500).json({ error: 'Failed to download event data' });
                } else {
                    // Delete the temporary PDF file after sending
                    fs.unlinkSync(pdfFilePath);
                }
            });
        });
    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ error: 'Failed to generate PDF' });
    }
});



module.exports=app;
