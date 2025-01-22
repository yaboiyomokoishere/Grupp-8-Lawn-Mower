const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    sender_id: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, "Sender required"]
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