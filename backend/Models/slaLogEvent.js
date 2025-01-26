const mongoose = require("mongoose");

const logEventSchema = mongoose.Schema({
    action: {
        type: String,
        default: "Unknown",
    },
    changed_by: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    }, 
},
{
    timestamps: true,
});

module.exports = mongoose.model("event", logEventSchema );