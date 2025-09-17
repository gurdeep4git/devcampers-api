const ApiError = require("../utils/api-error");

const errorHandler = (err, req, res, next) => {
    let error = {...err};
    error.message = err.message;
    error.statusCode = err.statusCode || 500;

    // Mongoose bad ObjectId
    if(err.name === 'CastError'){
        error = new ApiError(404, `Resource not found with id ${error.value}`)
    }

    // Duplicate error handling
    if(err.code === 11000){
        error = new ApiError(400, `Duplicate field entered`)
    }

    //Validation error handling
    if(err.name === 'ValidationError'){
        const message = Object.values(error.errors).map(i=>i.message);
        error = new ApiError(400, message);
    }
    
    res.status(error.statusCode).json({
        success:false,
        error:error?.message || 'Server error' 
    })

}

module.exports = errorHandler;