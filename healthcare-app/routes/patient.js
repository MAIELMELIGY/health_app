const express = require('express');
const { bookVisit, viewVisits,listDoctors } = require('../controllers/patientController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Patient
 *   description: Patient management routes
 */

/**
 * @swagger
 * /api/patient/book:
 *   post:
 *     summary: Book a visit with a doctor
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               doctorId:
 *                 type: integer
 *                 description: ID of the doctor to book the visit with
 *     responses:
 *       201:
 *         description: Visit booked successfully
 *       404:
 *         description: Doctor not found
 *       500:
 *         description: Failed to book visit
 */
router.post('/book', authenticate, authorize(['Patient']), bookVisit);
/**
 * @swagger
 * /api/patient/view-visits:
 *   get:
 *     summary: View all visits of the logged-in patient
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of patient's visits
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   doctorId:
 *                     type: integer
 *                   status:
 *                     type: string
 *                   totalAmount:
 *                     type: number
 *       500:
 *         description: Failed to retrieve visits
 */
router.get('/view-visits', authenticate, authorize(['Patient']), viewVisits);

/**
 * @swagger
 * /api/patient/list-doctors:
 *   get:
 *     summary: List all available doctors
 *     tags: [Patient]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of available doctors
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Failed to retrieve doctors
 */


router.get('/list-doctors', authenticate, authorize(['Patient','finance']), listDoctors);

module.exports = router;
