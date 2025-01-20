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
        default: Date.now,
    },
    end_date: {
        type: String,
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
    height_MoE:{        //Margin of Error
        type: Number,
        default: 0.15, 
    },
    working_area_MoE:{
        type: Number,
        default: 0.9,
    },
    time_MoE:{
        type: Number,
        default: 1, 
    }, 
}, 
{
    timestamps: true,
});



module.exports = mongoose.model("sla", slaSchema );