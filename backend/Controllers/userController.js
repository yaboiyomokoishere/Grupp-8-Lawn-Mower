const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../Models/userModel");

//@desc Register a user
//@route POST /api/user/register
//@access public
const registerUser = asyncHandler(async (req,res) => {
    
    const { firstName, lastName, email, password, address, phone, postalCode } = req.body;
    //console.log(req.body)

    const userExists = await User.findOne({email});
    
    if(userExists) { 
        
        res.status(400);
        throw new Error("Email already registered");
    }

    //hash password
    const hashedPassword = await bcrypt.hash(password, 10); 
    
    try {
        const user = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: email,
            password: hashedPassword,
            address: address,
            phone_number: phone,
            postal_code: postalCode,
            role: "customer", // Assuming a default role
        });
        
        console.log(user)
        if (user) {
            //res.status(201).json({_id: user.id, email: user.email });
            res.status(201).json({message: 'Registration successfull'});
        } else {
            res.status(400);
            throw new Error("User data is invalid");
        }
    }catch (error) {
        console.log(error);
    }
});

//@desc Login a user
//@route POST /api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    // If either the email or password is missing return an error
    // MAY BE REMOVED WHEN VALIDATION ON THE FRON IT ADDED 
    if (!email || !password){
        res.status(400);
        throw new Error("All fields are mandatory!")
    }   

    // Check if user exists in database
    const user = await User.findOne({ email});
    
    if (user && (await bcrypt.compare(password, user.password))) { // If user exists and password is correct
        // Create access token containing username, email and id
        const accessToken = jwt.sign({
            user: {
                username: user.username,
                email: user.email,
                id: user.id,
            },
        }, process.env. ACCESS_TOKEN_SECRET,{ expiresIn: "10m"}); // Testing interceptors 30m

        const refreshToken = jwt.sign({
            username: user.username,
            email: user.email,
            id: user.id,
        }, process.env.REFRESH_TOKEN_SECRET, {expiresIn: "7d"});
        
        // Set the refresh token to a cookie
        res.cookie('jwt', refreshToken, { 
            domain: 'localhost',
            path: '/',
            httpOnly: true, secure: true, sameSite: 'strict',
            maxAge: 7*24*60*60*1000 // Cookie expires in a week
        })
        
        res.status(200).json({accessToken}); 
        // res.send({message: "Login successfull"});	
    }else {
        // If user does not exist or password is incorrect
        res.status(401).json({message: "Unauthorized"});
        // throw new Error("email or password invalid")
    }
});

const logoutUser = asyncHandler(async (req, res) => {
    // Consle log the value of the cookie
    
    res.clearCookie('jwt');
    res.status(200).json({message: "Logout successfull"});
});

//@desc Current user info
//@route GET /api/user/current
//@access private
const currentUser = asyncHandler(async (req,res) => {
    // Returns the user object
    res.json(req.user); // PROBABLY ONLY NEED ID
});


const refreshToken = asyncHandler(async (req, res) => {
    // Check if the cookie is present in the request
    if (req.cookies?.jwt) { // If the cookie is not present it will return undefined/null
        // Getting refreshToken from cookie
        const refreshToken = req.cookies.jwt;
        // Verify the refresh token
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err) {
                    // Wrong Refesh Token
                    return res.status(406).json({ message: 'Unauthorized' });
                }
                else {
                    // Correct refresh token so we create a new access token
                    const accessToken = jwt.sign({
                        user : {
                            username: decoded.username,
                            email: decoded.email,
                            id: decoded.id,    
                        }
                    }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "10m"});

                    return res.status(200).json({ accessToken });
                }
            })
    } else { // If the cookie is not present
        return res.status(406).json({ message: 'Unauthorized -> Redirect to login' });
    }
})


module.exports = {registerUser, loginUser, currentUser, logoutUser, refreshToken};
