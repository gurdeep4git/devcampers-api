const User = require("../models/User");
const ApiError = require("../utils/api-error");

exports.register = async (req,res,next) => {
    try {
        const user = await User.create(req.body) 
        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error)
    }
}

exports.login = async (req,res,next) => {
    try {
        const {email, password} = req.body;

        if(!email || !password){
            return next(new ApiError(400, `Please provide email and password`))
        }

        const user = await User.findOne({email}).select('+password');

        if(!user){
            return next(new ApiError(401, `Invalid credentails`))
        }

        const isMatch = await user.comparePassword(password);

        if(!isMatch){
            return next(new ApiError(401, `Invalid credentails`))
        }
        
        sendTokenResponse(user, 200, res);

    } catch (error) {
        next(error)
    }
}

exports.getMe = async (req,res,next) => {
    try {
        const user = await User.findById(req.user.id);
        res
        .status(200)
        .json({
            success:true,
            data:user
        })

    } catch (error) {
        next(error)
    }
}
// @desccription    update user details
// @route           PUT /api/v1/auth/update-details
// @access          Private   
exports.updateDetails = async (req,res,next) => {
    try {
        const user = await User.findByIdAndUpdate(req.user.id, {name:req.body.name, email:req.body.email}, {
            new:true,
            runValidators:true
        });

        res
        .status(200)
        .json({
            success:true,
            data:user
        })
    } catch (error) {
        next(error)
    }
}
// @desccription    update user password
// @route           PUT /api/v1/auth/update-password
// @access          Private  
exports.updatePassword = async (req,res,next) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        //check the current password matches
        const isMatch = await user.comparePassword(req.body.currentPassword);

        if(!isMatch){
            return next(new ApiError(401, `Invalid password`))
        }

        user.password = req.body.newPassword;

        await user.save()

        sendTokenResponse(user,200,res);

    } catch (error) {
        next(error)
    }
}

const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJWTToken();

    const options = {
        expires:new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
        httpOnly:true,
    }

    if(process.env.NODE_ENV === 'production'){
        options.secure = true;
    }

    res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
        success:true,
        token
    })
}