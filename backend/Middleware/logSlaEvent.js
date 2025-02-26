const Log  = require('../Models/slaLogModel');
const User = require('../Models/userModel');
const Sla  = require('../Models/slaModel');
var nodemailer = require('nodemailer');


const logSlaEvent = async function (sla_id, action, actor, description = "", err_message) {
    const log  = await Log.findOne({sla_id: sla_id});
    
    if(!log) {
        res.status(400);
        throw new Error(err_message);
    }
    const event = {action: action, changed_by: actor, description: description, date: new Date()};
    log.events.push(event);
    await log.save();

    // Notify the user (need var to check if notifications are on?)
    //console.log("1")
    const sla  = await Sla.findById(sla_id);
    const user = await User.findById(sla.customer_id) 
    //console.log("2")
    //console.log(user)

    if(user && user._id != actor){
        // console.log("3")
        // console.log("User email: ", user.email)

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'deprojekt0@gmail.com',
              pass: 'xhsy zddo vwml xgwa'
            }
        });

        var mailOptions = {
            from: 'deprojekt0@gmail.com',
            to: user.email,
            subject: 'Service-Level-Agreement Update - ' + actor,
            text: description
        };
        //console.log("4")  
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        }); 
       
    }  
    //console.log("5")   
}


module.exports = logSlaEvent