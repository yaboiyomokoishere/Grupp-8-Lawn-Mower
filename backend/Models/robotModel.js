const mongoose = require("mongoose");

const robotSchema = mongoose.Schema({
    model: {
        type: String,
        required: [true, "Model required"],
        default: "Robot 1"
    },
    status: {
        type: String,
        required: [true, "Status required"],
        default: "Available" // Other options: "Under Maintenance", "Broken", "In service"
    },
    current_cut_area: {
        type: Number,
        default: 0
    },
    serial_number: {
        type: Number,
        required: [true, "Serial number required"],
        unique: [true, "Serial number already taken"]
    },
    last_maintenance_date: {
        type: Date
    },
    booking_schedule:[{
        sla_id: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'sla'
        },
        start_date: {
            type: Date,
            required: [true, "Start date required"],
        },
        end_date: {
            type: Date,
            required: [true, "End date required"],
        }
    }]
});

module.exports = mongoose.model("robot", robotSchema );