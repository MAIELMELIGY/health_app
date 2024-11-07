const express = require('express');
const { startVisit, addTreatment, completeVisit } = require('../controllers/doctorController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Doctor
 *   description: Doctor management routes
 */

/**
 * @swagger
 * /api/doctor/start-visit:
 *   post:
 *     summary: Start a visit
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Visit started successfully
 *       404:
 *         description: Visit not found or already in progress
 *       500:
 *         description: Failed to start visit
 */
router.post('/start-visit', authenticate, authorize(['Doctor']), startVisit);

/**
 * @swagger
 * /api/doctor/add-treatment:
 *   post:
 *     summary: Add a treatment to an ongoing visit
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitId:
 *                 type: integer
 *                 description: ID of the ongoing visit
 *               description:
 *                 type: string
 *                 description: Description of the treatment
 *               value:
 *                 type: number
 *                 description: Cost of the treatment
 *     responses:
 *       200:
 *         description: Treatment added successfully and total amount updated
 *       404:
 *         description: Visit not found or not in progress
 *       500:
 *         description: Failed to add treatment
 */

router.post('/add-treatment', authenticate, authorize(['Doctor']), addTreatment);
/**
 * @swagger
 * /api/doctor/complete-visit:
 *   post:
 *     summary: Complete a patient's visit
 *     tags: [Doctor]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               visitId:
 *                 type: integer
 *                 description: ID of the visit to complete
 *     responses:
 *       200:
 *         description: Visit completed successfully
 *       404:
 *         description: Visit not found or not in progress
 *       500:
 *         description: Failed to complete visit
 */

router.post('/complete-visit', authenticate, authorize(['Doctor']), completeVisit);
module.exports = router;
