const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    sender: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Sender required"]
    },
    sender_name: {
        type: String,
        required: [true, "Sender name required"],
    },
    sla_id: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'sla',
        required: [true, "SLA ID required"]
    },
    description: {
        type: String,
        required: [true, "Description required"],
    },
},
{
    timestamps: true,
});

module.exports = mongoose.model("report", reportSchema );