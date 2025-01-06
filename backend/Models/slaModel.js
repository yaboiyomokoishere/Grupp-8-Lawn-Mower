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
    price: {       
        type: String, 
        default: "0",
    },
    type: {
        type: String,
        required: [true, "Type mandatory"],
        default: "Standard",
    },
    address: {
        type: String,
        required: [true, "Address mandatory"],

    },
    start_date: {
        type: Date,
        required: [true, "Start date required"],
        default: Date.now,
    },
    end_date: {
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

const slaLogSchema = mongoose.Schema({
    sla_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'sla'
    },
    status: {
        type: String,
        default: "Pending",
    },
    action: {
        type: String,
        default: "Pending",
    },
    changed_by: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("sla", slaSchema );
module.exports = mongoose.model("sla_log", slaLogSchema );