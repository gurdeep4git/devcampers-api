const express = require("express");
const {
    getReviews,
    getReview,
    createReview,
    updateReview,
    deleteReview
} = require("../controllers/reviews-controller");

const Review = require("../models/Review");

const router = express.Router({mergeParams:true});

const advanceResults = require("../middlewares/advance-results");
const { protect, authorize } = require("../middlewares/auth");
const { deleteCourse } = require("../controllers/courses-controller");

router.route('/').get(advanceResults(Review), getReviews)

router.route('/').post(protect,authorize('user', 'admin'), createReview)

router.route('/:id').get(getReview)

router.route('/:id').put(protect,authorize('publisher', 'admin'), updateReview)

router.route('/:id').delete(protect, authorize('publisher','admin'), deleteReview);

module.exports = router;    