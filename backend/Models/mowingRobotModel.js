const mongoose = require("mongoose");

const mowingRobotSchema = mongoose.Schema({
    status: {
        type: String,
        default: "Pending",
    },
    last_maintenance_date: {
        type: Date,
        default: Date.now,
    },
    serial_number: {
        type: Number,
        required: [true, "Serial number required"],
        unique: [true, "Serial number already taken"]
    }
});

module.exports = mongoose.model("robot", mowingRobotSchema );