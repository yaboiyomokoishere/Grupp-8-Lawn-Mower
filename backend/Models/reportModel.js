const mongoose = require("mongoose");

const reportSchema = mongoose.Schema({
    sender: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    description: {
        type: String,
        required: [true, "Description required"],
    },
    sla_id: {
        type: typeof mongoose.Schema.Types.ObjectId,
        ref: 'sla',
        required: true
    }
},
{
    timestamps: true,
});

module.exports = mongoose.model("report", reportSchema );