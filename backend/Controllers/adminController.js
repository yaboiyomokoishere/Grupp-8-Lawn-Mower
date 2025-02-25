const asyncHandler = require("express-async-handler");
const PriceList = require("../Models/priceListModel");
const User = require("../Models/userModel");
const Sla = require("../Models/slaModel");
const logSlaEvent = require ("../Middleware/logSlaEvent");
const bcrypt = require('bcrypt');

//----------------------------------------USER ROUTES-----------------------------
const getUsers = asyncHandler(async (req, res) => {
    const users = await User.find({role: req.query.role});
    if(!users) {
        res.status(404).json({message: 'error while fetching list of type ' + req.body.role});
    }
    res.status(200).json(users);
});

const getUser = asyncHandler(async (req, res) => {
    const id = req.query.id;
    const user = await User.findById(id); 
    if(!user){
        res.status(404).json({message: 'User not found'});
        throw new Error("User not found");
    }
    res.status(200).json(user);
});


const toggleUserStatus = asyncHandler(async (req, res) => {
    const id = req.body.id;
    const user = await User.findById(id);
    if (!user) {
        res.status(404).json({ message: 'Error while searching for the user.' });
        return;
    }
    user.status = user.status === 'active' ? 'inactive' : 'active';
    //console.log(user.status);
    await user.save();
    res.status(200).json({ status: user.status });
});

const createUser = asyncHandler(async (req, res) => {
    // console.log(req.body)
    // console.log("hej")
    try {
        const { 
            firstName, 
            lastName, 
            email, 
            password, 
            role, 
            customerDetails, 
            technicianDetails, 
            adminDetails 
        } = req.body;
        
        if (!firstName || !lastName || !email || !password || !role) {
            return res.status(400).json({message: 'Required fields missing'});
        }

        const validRoles = ['customer', 'technician', 'admin'];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: 'Invalid', validRoles: validRoles});
        }
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(406).json({ message: 'Email already registered' });
        }
        
        if (role === 'customer') {
            if (!customerDetails) {
                return res.status(400).json({ message: 'Customer details required',
                                              requiredFields: ['address', 'postal_code', 'phone_number']});
            }
            
            if (!customerDetails.address || !customerDetails.postal_code || !customerDetails.phone_number) {
                return res.status(400).json({message: 'Missing a customer details field'});
            }
        }
        // Add further validation for the other roles when the respesctive models are well defined.

        const hashedPassword = await bcrypt.hash(password, 10); // weakest salt in the west

        const userData = {
            first_name: firstName,
            last_name: lastName,
            email,
            password: hashedPassword,
            role,
            customer_details: customerDetails,
            technician_details: technicianDetails,
            admin_details: adminDetails
        };

        // Create user
        const newUser = await User.create(userData);
        if(newUser){
            console.log('Successfull creation');
            return res.status(201).json({ message: 'User created successfully'});  
        } else {
            console.log("Error while creating new user");
        }
    } catch (error) {
        console.error('User creation error:', error);
        return res.status(500).json({error: 'Error while creating user'});
    }
});


const updateUser = asyncHandler(async (req, res) => {
    // Updates only the generic fields of each user account. 
    // TODO: Implement role specific validation.
    const roles = ['customer', 'technician', 'organization'];
    if (!roles.includes(req.body.role)) {
        return res.status(400).json({ message: 'Error: role must be one of ' + roles.join(', ') });
    } 
    
    const id = req.body.id;
    const user = await User.findById(id);
    if (!user) {
        res.status(404).json({ message: 'Error while searching for the user.' });
        return;
    }
    //console.log(user);
    // Validering har inte implementerats än
    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.role = req.body.role;
    
    await user.save();
    res.status(200).json(user);        
});


//----------------------------------------SLA ROUTES-----------------------------
const getUserSlas = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.query.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const result = await Sla.find({customer_id: user._id}); 
        if(!result){
            res.status(404).json({message: 'Sla not found'});
        } else {
            //console.log(result)
            res.status(200).json({result});
        }
        return;
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error while fetching SLAs' });
    }
})

const updateSlaStatus = asyncHandler(async (req, res) => {
    try {
        const {id, status} = req.body;
        const validStatuses = ['Active', 'Paid', 'Pending', 'Completed', 'Fault']; // Should be stored in db?
        if (validStatuses.includes(status)){
            console.log('Input: ', id, ' ', status);
            const sla = await Sla.findById(id);
            sla.status = status;
            sla.save();
            return res.status(200).json({ message:"Status updated successfully" });    
        } else {
            console.log("Invalid status at updateSlaStatus.");
            return res.status(400).json({ message:"Invalid status" });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error while updating the SLA status.' });
    } 
});

const updateServiceDetails = asyncHandler(async (req, res) => {
    try {
        const { address, start_date, end_date, grass_height, working_area, current_cut_area, price } = req.body.slaDetails;
        if (!address || !start_date || !end_date ||
            !grass_height || !working_area ||
            !current_cut_area || !price) {
            return res.status(406).json({ message: 'All fields must be filled for the SLA to be valid.' });
        }

        const sla = await Sla.findById(req.body.id.id);
        if (!sla) {
            return res.status(404).json({ message: 'SLA not found' });
        }

        const oldValues = {
            grass_height: sla.grass_height,
            working_area: sla.working_area,
            price: sla.price
        };

        // Update SLA properties
        sla.address = address;
        sla.start_date = start_date;
        sla.end_date = end_date;
        sla.grass_height = grass_height;
        sla.working_area = working_area;
        sla.current_cut_area = current_cut_area;
        sla.price = price;
        
        await sla.save();

        const changes = [];
        if (oldValues.grass_height !== grass_height) {
            changes.push(`grass height from ${oldValues.grass_height}cm to ${grass_height}cm`);
        }
        if (oldValues.working_area !== working_area){
            changes.push(`working area from ${oldValues.working_area}m² to ${working_area}m²`);
        }
        if (oldValues.price !== price) {
            changes.push(`price from ${oldValues.price}kr to ${price}kr`);
        } 
        
        const description = changes.length > 0 
            ? 'Updated service details: ' + changes.join(', ')
            : 'Service details updated ';

        // Log the SLA event
        await logSlaEvent(
            sla._id,
            'Service Update',
            'Admin',  // Assuming authenticated user's ID is available
            description,
            'Failed to log SLA update event'
        );

        return res.status(200).json({ message: 'Updated successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Error while updating SLA details.' });
    }
});


//----------------------------------------??? ROUTES-----------------------------
const createPriceList = asyncHandler(async (req, res) => {
    // Created a price list for testing. Most values are defaults in the model and the
    // height prices are hardcoded. The actual implementation should receive all values  
    // from the request. 
    try {
        heightPrices = [
            {height:1.5, price:0},
            {height:1.0, price:0.01},
            {height:0.5, price:0.02}
        ];
        
        await PriceList.create({ 
            height_prices: heightPrices
        });
        res.status(200).json({message: 'Price list created successfully.'});
    } catch (error) {
        console.log(error);
        res.status(400).json({message: 'Error while creating price list.'});
    }
});


module.exports = {createPriceList, 
                getUsers, 
                getUser, 
                toggleUserStatus, 
                createUser,
                updateUser, 
                getUserSlas, 
                updateSlaStatus, 
                updateServiceDetails
            };