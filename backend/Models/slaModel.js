const mongoose = require("mongoose");

const slaSchema = mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    status: {
        type: String,
        default: "Pending",
    },
    Price: {       
        type: String, 
        default: "0",
    },
    Address: {
        type: String,
        required: [true, "Address mandatory"],

    },

    Start_date: {
        type: Date,
        required: [true, "Start date required"],
        default: Date.now,
    },
    
    End_date: {
        type: Date,
        required: [true, "End date required"],
        
    },
    cancellation_fee: {
        type: String,
        default: "400",
    },
    grass_height: {
        type: String,
        required: true,

    },
    working_area: {
        type: String,
        required: true,

    },

}, 
{
    timestamps: true,
});

module.exports = mongoose.model("sla", slaSchema );