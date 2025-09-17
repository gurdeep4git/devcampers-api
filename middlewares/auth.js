
const User = require("../models/User");
const ApiError = require("../utils/api-error");
const jwt = require("jsonwebtoken")

exports.protect = async (req,res,next) => {
    try {
        let token;

        if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
            token = req.headers.authorization.split(' ')[1];
        } 
        
        // else if(req.cookies.token){
        //     token = req.cookies.token
        // }

        if(!token){
            return next(new ApiError(401, `Not authorized to access this route`))
        }

        // verify token
        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode.id);

        req.user = user;

        next();

    } catch (error) {
        next(error)
    }
}

exports.authorize = (...roles) => {
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ApiError(403, `${req.user.role} role is not authorized to access this route`))
        }
        next()
    }
}