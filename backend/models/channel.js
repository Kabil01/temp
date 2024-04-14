const mongoose = require("mongoose")
const channelSchema = new mongoose.Schema({
    roll_number:{
        type:String,
        required: true,
        trim: true
    },
    name:{
        type:String,

        required:true,
        trim:true
   },
    nss_unit_number: {
        type: String,
        trim: true
    },
    from_year: {
        type: Number,
        required: true
    },
    to_year: {
        type: Number,
        required: true
    },
    contact_number: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        trim: true
    },  
    dateofbirth: {
        type: Date,
        require:true
    },
    blood_group:{
        type:String,
        require:true
    },
});

const ChannelModel=mongoose.model("Channel",channelSchema,"Student_Details")
module.exports=ChannelModel