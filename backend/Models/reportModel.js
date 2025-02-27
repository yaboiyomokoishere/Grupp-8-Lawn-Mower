const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    sender_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Sender required"]
    },
    sla_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sla',
        required: [true, "SLA ID required"]
    },
    description: {
        type: String,
        required: [true, "Description required"],
    },
    title: {
        type: String,
        required: [true, "Title required"],
    },
    status: {
        type: String,
        enum: ["Received", "Solved"],
        default: "Received",
    },
    messages: [
        {
            type: String
        }
    ]
},
{
    timestamps: true,
});

module.exports = mongoose.model("report", reportSchema );