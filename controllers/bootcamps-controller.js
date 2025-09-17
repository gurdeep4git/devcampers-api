const Bootcamp = require("../models/Bootcamp");
const ApiError = require("../utils/api-error");

// @desccription    get all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public    
exports.getBootcamps = async (req, res, next) => {
    try {
        res
        .status(200)
        .json(res.advanceResults)
    } catch (error) {
        next(error);
    }
}
// @desccription    get single bootcamp
// @route           GET /api/v1/bootcamps/:id
// @access          Public    
exports.getBootcamp = async (req, res, next) => {
    try {
        const bootcamp = await Bootcamp.findById(req.params.id).populate('courses')

        if(!bootcamp){
            // Pass error to middleware
            return next(new ApiError(404, `Bootcamp not found with id ${req.params.id}`))
        }

        res.status(200).json({success:true, data:bootcamp});
    } catch (error) {
        // Pass error to error middleware
        next(error);
    }
}
// @desccription    create new bootcamp
// @route           POST /api/v1/bootcamps
// @access          Private    
exports.createBootcamp = async (req, res, next) => {
    try {
        req.body.user = req.user.id;

        //Business logic
        // Publisher can only add one bootcamp
        // If the user is not admin, they can publish only one bootcamp
        const publishedBootcamp = await Bootcamp.findOne({user: req.user.id})

        if(publishedBootcamp && req.user.role !=='admin'){
            return next(new ApiError(400, `User with id ${req.user.id} has already published a bootcamp`))
        }

        const bootcamp = await Bootcamp.create(req.body)
        res
        .status(201)
        .json({
            success:true,
            data:bootcamp
        })
    } catch (error) {
        next(error);
    }
    
}
// @desccription    update bootcamp
// @route           PUT /api/v1/bootcamps/:id
// @access          Private    
exports.updateBootcamp = async (req, res, next) => {
    try {
        let bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return next(new ApiError(404, `Bootcamp not found with id ${req.params.id}`))
        }

        //Ownership
        //If person who is updating is the owner or not
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ApiError(401, `User ${req.user.id} is not authorized to update`))
        }

        bootcamp = await Bootcamp.findOneAndUpdate({ _id: req.params.id }, req.body, {
            new:true,
            runValidators:true
        })

        res.status(200).json({
            success:true,
            data:bootcamp
        })
        
    } catch (error) {
        next(error);
    }
    
}
// @desccription    delete bootcamp
// @route           DELETE /api/v1/bootcamps/:id
// @access          Private    
exports.deleteBootcamp = async (req, res, next) => {
    try {
        let bootcamp = await Bootcamp.findById(req.params.id);

        if(!bootcamp){
            return next(new ApiError(404, `Bootcamp not found with id ${req.params.id}`))
        }

        //Ownership
        //If person who is updating is the owner or not
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ApiError(401, `User ${req.user.id} is not authorized to delete`))
        }

        await bootcamp.deleteOne();

        res.status(200).json({
            success:true,
            data:{}
        })
        
    } catch (error) {
        next(error);
    }
}