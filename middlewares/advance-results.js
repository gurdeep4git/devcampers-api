const advanceResults = (model, modelToPopulate) => async (req, res, next) => {
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
    query = model.find(JSON.parse(queryStr))

    if(modelToPopulate){
        query = query.populate(modelToPopulate);
    }

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

    const totalRecords = await model.countDocuments(JSON.parse(queryStr));
    const totalPages = Math.ceil(totalRecords / limit);

    query = query.skip(offset).limit(limit);

    const results = await query;

    const pagination = {
        page,
        offset,
        limit,
        totalRecords,
        totalPages
    };

    res.advanceResults = {
        success:true,
        count:results.length,
        data:results,
        pagination
    }

    next();
}
module.exports = advanceResults;