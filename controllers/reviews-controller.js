const Bootcamp = require("../models/Bootcamp");
const Review = require("../models/Review");
const ApiError = require("../utils/api-error");

// @desccription    get all reviews
// @route           GET /api/v1/reviews
// @route           GET /api/v1/bootcamp/:bootcampId/reviews
// @access          Public    
exports.getReviews = async (req, res, next) => {
    try {
        if(req.params.bootcampId){
            const reviews = await Review.find({bootcamp : req.params.bootcampId})
            res.status(200).json({
                success:true,
                count:reviews.length,
                data:reviews
            })
        } else {
            res.status(200).json(res.advanceResults)
        }
    } catch (error) {
        next(error);
    }
}

// @desccription    get single review
// @route           GET /api/v1/reviews/:id
// @access          Public    
exports.getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id).populate({
            path:'bootcamp',
            select:'name description'
        })
        
        if(!review){
            return next(new ApiError(404, `Review not found with id ${req.params.id}`))
        }

        res.status(200).json({
            success:true,
            data:review
        })
    } catch (error) {
        next(error);
    }
}

// @desccription    crete a review
// @route           POST /api/v1/bootcamps/:bootcampId/reviews
// @access          Private
exports.createReview = async (req, res, next) => {
    try {
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;

        const bootcamp = await Bootcamp.findById(req.params.bootcampId);
        
        if(!bootcamp){
            return next(new ApiError(404, `Bootcamp not found with id ${req.params.bootcampId}`))
        }

        const review = await Review.create(req.body);

        res.status(201).json({
            success:true,
            data:review
        })

    } catch (error) {
        next(error);
    }
}
// @desccription    update review
// @route           PUT /api/v1/reviews/:id
// @access          Private    
exports.updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id)

        if(!review){
            return next(new ApiError(404, `Review not found with id ${req.params.id}`))
        }

        //Ownership
        //If person who is adding the course is the owner or not
        if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ApiError(401, `User ${req.user.id} is not authorized to update a review ${review._id}`))
        }

        review = await Review.findByIdAndUpdate({ _id: req.params.id }, req.body, {
            new:true,
            runValidators:true
        })

        res.status(200).json({
            success:true,
            data:course
        })
        
    } catch (error) {
        next(error);
    }
    
}
// @desccription    delete review
// @route           DELETE /api/v1/course/:id
// @access          Private    
exports.deleteCourse = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id)

        if(!review){
            return next(new ApiError(404, `Review not found with id ${req.params.id}`))
        }

        //Ownership
        //If person who is adding the course is the owner or not
        if(review.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ApiError(401, `User ${req.user.id} is not authorized to delete a review ${review._id}`))
        }

        await review.deleteOne();

        res.status(200).json({
            success:true,
            data:{}
        })
        
    } catch (error) {
        next(error);
    }
}
