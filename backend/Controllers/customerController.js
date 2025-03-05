const asyncHandler = require("express-async-handler");
const User = require("../Models/userModel");
const bcrypt = require("bcrypt");
const Report = require("../Models/reportModel");
const Sla = require("../Models/slaModel")
const logSlaEvent = require ("../Middleware/logSlaEvent");
const { json } = require("express");

const getCustomerInfo = asyncHandler(async (req,res) => {
    const {id} = req.user;
    const user = await User.findById(id); 
    
    if (user) {
        //console.log(user);
        res.status(200).json(user);
    } else {
        res.status(404);
        throw new Error("Error: user not found");
    }
});

const updateCustomerProfile = asyncHandler(async (req,res) => {
    const {id} = req.user;
    const user = await User.findById(id); 
    if(!user){
        return res.status(404).json("User not found");
    }
    // The customer email is being updated.
    if (req.body.email && req.body.email !== user.email) { 
        const sameUser = await User.findOne({ email: req.body.email });
        if (sameUser && sameUser.id !== user.id) { // Email is already registered by another user
            res.status(400).json({ message: 'Email already taken.' });
        } else { // Email is not registered by another user
            user.email = req.body.email;
            console.log("Email updated.");
        }
    } 
    
    // Check whether each field is being updated
    
    if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10); 
        if (hashedPassword !== user.password) { // pass is being changed
            user.password = hashedPassword;
            console.log("Password updated.");
        }
    }

    if (req.body.first_name && req.body.first_name !== user.first_name) {
        user.first_name = req.body.first_name;
        console.log("First name updated.");
    }
    if (req.body.last_name && req.body.last_name !== user.last_name) {
        user.last_name = req.body.last_name;
        console.log("Last name updated.");
    }
    if(req.body.phone_number && req.body.phone_number !== user.customer_details.phone_number) {
        user.customer_details.phone_number = req.body.phone_number;
        console.log("Phone number updated.");
    }
    if (req.body.address && req.body.address !== user.customer_details.address) {
        user.customer_details.address = req.body.address;
        console.log("Address updated.");
    }
    if (req.body.postal_code && req.body.postal_code !== user.customer_details.postal_code) {
        console.log("Postal code updated.");
        user.customer_details.postal_code = req.body.postal_code;
    }
    // Save all changes.
    await user.save();
    res.status(200).json({message: 'Profile updated successfully'});
});

const getUser = asyncHandler(async (req) => {
    const {id} = req.user;
    const user = await User.findById(id).select("-password"); 
    if(!user){
        throw new Error("User not found");
    }
    return user;
})

const sendReport = asyncHandler(async (req, res) => {
    //console.log(req.body)
    try {
        const sla = await Sla.findById(req.body.id);
        if(sla.status == "Pending" || sla.status == "Paid" || sla.status == "Active" || sla.status == "Fault") {
            console.log(req.user.id);
            console.log(sla.id);
            console.log(req.body.description); 
            const report = await Report.create({
                sender_id: req.user.id,
                sla_id: sla._id,
                description: req.body.description,
                title: req.body.title,
            });
            
            res.status(200).json({message: 'Report submitted'});
        } else {
            res.status(400).json({message: 'Can not report closed SLA'});
        }
    } catch {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
})


const getCustomerReports = asyncHandler(async (req, res) => {
    try {
        const report = await Report.find({sla_id: req.query.id});

        if(report.length > 0) {
            res.status(200).json({message: 'Reports found', data: report});
        } else {
            res.status(400).json({message: 'No report found'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
})

const getAllReports = asyncHandler(async (req, res) => {
    try {
        const report = await Report.find({status: req.query.status});
        console.log(report);
        // if(report.length > 0) {
        //     res.status(200).json({message: 'Report found',report});
        // } else {
        //     res.status(400).json({message: 'No report found'});
        // }
        res.json(report);
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
})

const updateReportStatus = asyncHandler(async (req,res) => {
    try {
        const report = await Report.findById(req.body.id);
        console.log(report.sla_id);
        if(report) {
            report.status = 'Solved';
            report.save();
            description = `The issue with the report - ${ report.title } -has been resolved. Report archived.`;
            await logSlaEvent(
                report.sla_id,
                'Report Update',
                'Admin/Technician',  
                description,
                'Failed to log SLA update event'
            );
            res.status(200).json({message: 'Report status updated', data: report});
        } else {
            res.status(400).json({message: 'No report found'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Server error'});
    }
});

module.exports = {getUser, getCustomerInfo, updateCustomerProfile, sendReport, getCustomerReports, getAllReports, updateReportStatus};