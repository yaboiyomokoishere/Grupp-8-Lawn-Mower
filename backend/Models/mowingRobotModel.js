const mongoose = require("mongoose");

// Scema for mowing robot
const robotSchema = mongoose.Schema({
    status: {
        type: String,
        required: [true, "Status required"],
        default: "Available" // Other options: "Not Available", "Under Maintenance" 
    },
    serial_number: {
        type: Number,
        required: [true, "Serial number required"],
        unique: [true, "Serial number already taken"]
    },
    last_maintenance_date: {
        type: Date,
        required: [true, "Last maintenance date required"],
        default: Date.now,
    }
});

module.exports = mongoose.model("robot", robotSchema );