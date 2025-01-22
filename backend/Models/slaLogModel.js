const mongoose = require("mongoose");

const slaLogSchema = mongoose.Schema({
    sla_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'sla'
    },
    events: [{
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
    }]  
});


module.exports = mongoose.model("sla_log", slaLogSchema );