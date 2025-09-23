const Bootcamp = require("../models/Bootcamp");
const Course = require("../models/Course");
const ApiError = require("../utils/api-error");

// @desccription    get all courses
// @route           GET /api/v1/courses
// @route           GET /api/v1/bootcamp/:bootcampId/courses
// @access          Public    
exports.getCourses = async (req, res, next) => {
    try {
        if(req.params.bootcampId){
            const courses = await Course.find({bootcamp : req.params.bootcampId})
            res.status(200).json({
                success:true,
                count:courses.length,
                data:courses
            })
        } else {
            res.status(200).json(res.advanceResults)
        }
    } catch (error) {
        next(error);
    }
}

// @desccription    get single courses
// @route           GET /api/v1/courses/:id
// @access          Public   
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id).populate({
            path:'bootcamp',
            select:'name description'
        });

        if(!course){
            return next(new ApiError(404, `Course not found with id ${req.params.id}`))
        }

        res.status(200).json({
            success:true,
            data:course,
        })    

    } catch (error) {
        next(error)
    }
} 

// @desccription    create course
// @route           POST /api/v1/bootcamps/:bootcampId/courses
// @access          Private   
exports.createCourse = async (req,res, next) => {
    try {
        req.body.bootcamp = req.params.bootcampId;
        req.body.user = req.user.id;

        const bootcamp = await Bootcamp.findById(req.params.bootcampId);

        if(!bootcamp){
            return next(new ApiError(404, `Bootcamp not found with id ${req.params.bootcampId}`))
        }

        //Ownership
        //If person who is adding the course is the owner or not
        if(bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ApiError(401, `User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`))
        }

        const course = await Course.create(req.body);

        res.status(201).json({
            success:true,
            data:course
        })
    } catch (error) {
        next(error)
    }
}

// @desccription    update course
// @route           PUT /api/v1/courses/:id
// @access          Private    
exports.updateCourse = async (req, res, next) => {
    try {
        let course = await Course.findById(req.params.id)

        if(!course){
            return next(new ApiError(404, `Course not found with id ${req.params.id}`))
        }

        //Ownership
        //If person who is adding the course is the owner or not
        if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ApiError(401, `User ${req.user.id} is not authorized to update a course ${course._id}`))
        }

        course = await Course.findByIdAndUpdate({ _id: req.params.id }, req.body, {
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
// @desccription    delete course
// @route           DELETE /api/v1/course/:id
// @access          Private    
exports.deleteCourse = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id)

        if(!course){
            return next(new ApiError(404, `Course not found with id ${req.params.id}`))
        }

        //Ownership
        //If person who is adding the course is the owner or not
        if(course.user.toString() !== req.user.id && req.user.role !== 'admin'){
            return next(new ApiError(401, `User ${req.user.id} is not authorized to delete a course ${course._id}`))
        }

        await course.deleteOne();

        res.status(200).json({
            success:true,
            data:{}
        })
        
    } catch (error) {
        next(error);
    }
}