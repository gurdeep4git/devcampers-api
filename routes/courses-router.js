const express = require("express");
const {
    getCourses,
    getCourse,
    createCourse,
    updateCourse,
    deleteCourse
} = require("../controllers/courses-controller");

const router = express.Router({mergeParams:true});
/**
 * @swagger
 * /courses:
 *   get:
 *     summary: Get all courses
 *     description: Retrieve a list of all courses with bootcamp info
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 3
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       500:
 *         description: Server error
 */

/**
 * @swagger
 * /bootcamps/{bootcampId}/courses:
 *   get:
 *     summary: Get courses for a specific bootcamp
 *     description: Retrieve a list of courses offered by a specific bootcamp
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: bootcampId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bootcamp
 *     responses:
 *       200:
 *         description: A list of courses for the specified bootcamp
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 count:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Course'
 *       404:
 *         description: Bootcamp not found
 *       500:
 *         description: Server error
 */
router.route('/').get(getCourses);

/**
 * @swagger
 * /bootcamps/{bootcampId}/courses:
 *   post:
 *     summary: Create a new course
 *     description: Create a new course associated with a specific bootcamp
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: bootcampId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the bootcamp to associate the course with
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course successfully created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Bootcamp not found
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: Server error
 */

router.route('/').post(createCourse);

/**
 * @swagger
 * /courses/{id}:
 *   get:
 *     summary: Get a single course by ID
 *     description: Retrieve a single course with its associated bootcamp details (name and description)
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course
 *     responses:
 *       200:
 *         description: A course object
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       500:
 *         description: Server error
 */
router.route('/:id').get(getCourse);
/**
 * @swagger
 * /courses/{id}:
 *   put:
 *     summary: Update a course
 *     description: Update an existing course by its ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       200:
 *         description: Course successfully updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Course'
 *       404:
 *         description: Course not found
 *       400:
 *         description: Bad request or validation error
 *       500:
 *         description: Server error
 */
router.route('/:id').put(updateCourse);
/**
 * @swagger
 * /courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     description: Delete an existing course by its ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the course to delete
 *     responses:
 *       200:
 *         description: Course successfully deleted
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
 *         description: Course not found
 *       500:
 *         description: Server error
 */

router.route('/:id').delete(deleteCourse);

module.exports = router;

