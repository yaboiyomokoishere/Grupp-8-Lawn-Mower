const mongoose = require("mongoose");

// Schema for customer details
const customerDetailsSchema = mongoose.Schema({
    address: {
        type: String,
        required: [true, "Address required"]
    },
    postal_code: {
        type: Number,
        required: [true, "Postal code required"]
    },
    phone_number: {
        type: Number,
        required: [true]
    }
}, { _id: false }); // Prevent creation of a separate ID for the subschema

// Subschema for technician-specific details
const technicianDetailsSchema = mongoose.Schema({
    jobs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'sla',
        default: null
    }]
    // Calender
}, { _id: false });

// Subschema for admin-specific details
const adminDetailsSchema = mongoose.Schema({
    // TBD
}, { _id: false });

// Main User Schema
const userSchema = mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Add a first name"],
    },
    last_name: {
        type: String,
        required: [true, "Add a last name"],
    },
    email: {
        type: String,
        required: [true, "Add user email address"],
        unique: [true, "Email already taken"],
    },
    role: {
        type: String,
        required: [true, "Add user role"],
        enum: ["customer", "technician", "admin"], // Restrict to specific roles
    },
    status: {
        type: String,
        required: [true, "Add user status"],
        enum: ["active", "inactive"],  
        default: "active" 
    },
    password: {
        type: String,
        required: [true, "Add user password"],
        select: false
    },
    customer_details: {
        type: customerDetailsSchema,
        default: null // Only used for customers
    },
    technician_details: {
        type: technicianDetailsSchema,
        default: null // Only used for technicians
    },
    admin_details: {
        type: adminDetailsSchema,
        default: null // Only used for admins
    }
}, {
    timestamps: true,
});


module.exports = mongoose.model("User", userSchema);