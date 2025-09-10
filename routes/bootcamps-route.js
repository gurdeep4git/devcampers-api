const express = require("express");
const {
    getBootcamps, 
    getBootcamp, 
    createBootcamp,
    updateBootcamp, 
    deleteBootcamp
} = require("../controllers/bootcamps-controller");
const router = express.Router();

// Chaining of routes
router.route('/').get(getBootcamps).post(createBootcamp)
router.route('/:id').get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp)

/*
router.get(`/`, (req,res) => {
    res
    .status(200)
    .json({
        success:true,
        message:'Show all bootcamps'
    })
})

router.get(`/:id`, (req,res) => {
    res
    .status(200)
    .json({
        success:true,
        message:`Show bootcamp ${req.params.id}`
    })
})

router.post(`/`, (req,res) => {
    res
    .status(200)
    .json({
        success:true,
        message:`Create new bootcamp`
    })
})

router.put(`/:id`, (req,res) => {
    res
    .status(200)
    .json({
        success:true,
        message:`Update bootcamp ${req.params.id}`
    })
})

router.delete(`/:id`, (req,res) => {
    res
    .status(200)
    .json({
        success:true,
        message:`Delete bootcamp ${req.params.id}`
    })
})
*/

module.exports = router