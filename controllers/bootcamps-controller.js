const Bootcamp = require("../models/Bootcamp");
const ApiError = require("../utils/api-error");

// @desccription    get all bootcamps
// @route           GET /api/v1/bootcamps
// @access          Public    
exports.getBootcamps = async (req, res, next) => {
    try {
        let query;

        const queryObj = {...req.query}

        // remove keywords
        const removeFields = ['select', 'sort', 'page', 'limit'];
        removeFields.forEach(i=>delete queryObj[i]);

        // get query from req object
        let queryStr = JSON.stringify(queryObj);
        
        //add $ sign in front of opertors
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        // hit database with updated queryStr
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

        //Select
        if(req.query.select){
            const fields = req.query.select.split(',').join(' ')
            query = query.select(fields)
        }

        //Sort
        if(req.query.sort){
            const sortBy = req.query.sort.split(',').join(' ')
            query = query.sort(sortBy)
        } else{
            query = query.sort('-createdAt')
        }

        //Paging
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const offset = (page - 1) * limit;

        const totalRecords = await Bootcamp.countDocuments(JSON.parse(queryStr));
        const totalPages = Math.ceil(totalRecords / limit);

        query = query.skip(offset).limit(limit);
 
        const bootcamps = await query;

        const pagination = {
            page,
            offset,
            limit,
            totalRecords,
            totalPages
        };

        res
        .status(200)
        .json({
            success:true,  
            count:bootcamps.length,  
            pagination,
            data:bootcamps
        })
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
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
            new:true,
            runValidators:true
        })

        if(!bootcamp){
            return next(new ApiError(404, `Bootcamp not found with id ${req.params.id}`))
        }

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
        const bootcamp = await Bootcamp.findById(req.params.id)

        if(!bootcamp){
            return next(new ApiError(404, `Bootcamp not found with id ${req.params.id}`))
        }

        bootcamp.remove();

        res.status(200).json({
            success:true,
            data:{}
        })
        
    } catch (error) {
        next(error);
    }
}