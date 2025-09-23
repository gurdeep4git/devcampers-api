const express = require("express");
const {
    getBootcamps, 
    getBootcamp, 
    createBootcamp,
    updateBootcamp, 
    deleteBootcamp
} = require("../controllers/bootcamps-controller");
const Bootcamp = require("../models/Bootcamp");
const advanceResults = require("../middlewares/advance-results");
const {protect, authorize} = require("../middlewares/auth");

// Bring in the course router file
const coursesRouter = require('./courses-route');
const reviewsRouter = require('./reviews-route');

const router = express.Router();

// Re-route into other resource router
router.use('/:bootcampId/courses', coursesRouter);
router.use('/:bootcampId/reviews', reviewsRouter);

/**
 * @swagger
 * /bootcamps:
 *   get:
 *     summary: Get all bootcamps
 *     description: Retrieve a list of bootcamps with filtering, sorting, and pagination
 *     tags: [Bootcamps]
 *     parameters:
 *       - in: query
 *         name: select
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to return (e.g., "name,description")
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Comma-separated fields to sort by (e.g., "averageCost,-createdAt")
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 25
 *         description: Number of results per page
 *       - in: query
 *         name: averageCost[gt]
 *         schema:
 *           type: number
 *         description: Filter bootcamps where averageCost is greater than a value
 *       - in: query
 *         name: averageCost[lte]
 *         schema:
 *           type: number
 *         description: Filter bootcamps where averageCost is less than or equal to a value
 *     responses:
 *       200:
 *         description: A list of bootcamps
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 count:
 *                   type: integer
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     offset:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalRecords:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Bootcamp'
 */
router.route('/').get(advanceResults(Bootcamp,'courses'), getBootcamps)

/**
 * @swagger
 * /bootcamps:
 *   post:
 *     summary: Create a new bootcamp
 *     tags: [Bootcamps]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bootcamp'
 *     responses:
 *       201:
 *         description: Bootcamp created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Bootcamp'
 *       400:
 *         description: Validation error or bad input
 *       500:
 *         description: Server error
 */
router.route('/').post(protect, authorize('publisher','admin'), createBootcamp)


/**
 * @swagger
 * /bootcamps/{id}:
 *   get:
 *     summary: Get a single bootcamp by ID
 *     tags: [Bootcamps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bootcamp to retrieve
 *     responses:
 *       200:
 *         description: Bootcamp found successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Bootcamp'
 *       404:
 *         description: Bootcamp not found with the specified ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Bootcamp not found with id 64f123456789abcdef123456
 *       500:
 *         description: Server error
 */
router.route('/:id').get(getBootcamp)

/**
 * @swagger
 * /bootcamps/{id}:
 *   put:
 *     summary: Update a bootcamp by ID
 *     tags: [Bootcamps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bootcamp to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Bootcamp'
 *     responses:
 *       200:
 *         description: Bootcamp updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Bootcamp'
 *       404:
 *         description: Bootcamp not found with the given ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Bootcamp not found with id 64f123456789abcdef123456
 *       400:
 *         description: Validation error
 *       500:
 *         description: Internal server error
 */
router.route('/:id').put(protect, authorize('publisher','admin'), updateBootcamp)

/**
 * @swagger
 * /bootcamps/{id}:
 *   delete:
 *     summary: Delete a bootcamp by ID
 *     tags: [Bootcamps]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the bootcamp to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Bootcamp deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   example: {}
 *       404:
 *         description: Bootcamp not found with the given ID
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: string
 *                   example: Bootcamp not found with id 64f123456789abcdef123456
 *       500:
 *         description: Internal server error
 */
router.route('/:id').delete(protect, authorize('publisher','admin'), deleteBootcamp)

module.exports = router