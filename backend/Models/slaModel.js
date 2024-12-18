const mongoose = require("mongoose");

const slaSchema = mongoose.Schema({
    customer_id: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
    },
    status: {
        type: String,
        required: [true, "Add user email address"],
        unique: [true, "Email already taken"],
    },
    password: {
        type: String,
        required: [true, "Add user password"],

    },
}, 
{
    timestamps: true,
});

module.exports = mongoose.model("sla", slaSchema );