const express = require('express');
const { searchVisits, reviewVisit } = require('../controllers/financeController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Finance
 *   description: Finance management routes
 */

/**
 * @swagger
 * /api/finance/search-visits:
 *   get:
 *     summary: Search visits based on criteria
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: doctorName
 *         schema:
 *           type: string
 *         description: Name of the doctor
 *       - in: query
 *         name: patientName
 *         schema:
 *           type: string
 *         description: Name of the patient
 *       - in: query
 *         name: visitId
 *         schema:
 *           type: integer
 *         description: ID of the visit
 *     responses:
 *       200:
 *         description: List of visits
 *       500:
 *         description: Failed to search visits
 */
router.get('/search-visits', authenticate, searchVisits);

/**
 * @swagger
 * /api/finance/review-visit/{visitId}:
 *   get:
 *     summary: Review a specific visit's details
 *     tags: [Finance]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: visitId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the visit to review
 *     responses:
 *       200:
 *         description: Visit details
 *       404:
 *         description: Visit not found
 *       500:
 *         description: Failed to review visit
 */
router.get('/review-visit/:visitId', authenticate, reviewVisit);

module.exports = router;
