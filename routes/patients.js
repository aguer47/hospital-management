const express = require("express");
const patientsController = require("../controllers/patients");
const validatePatient = require("../middleware/validatePatient");
const authenticate = require("../middleware/authenticate");

const router = express.Router();


// GET all patients
/**
 * @swagger
 * /patients:
 *   get:
 *     summary: Get all patients
 *     description: Returns all patients
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", patientsController.getAllPatients);


// GET patient by ID
/**
 * @swagger
 * /patients/{id}:
 *   get:
 *     summary: Get a patient by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient found
 *       404:
 *         description: Patient not found
 */
router.get("/:id", patientsController.getPatientById);


// POST new patient
/**
 * @swagger
 * /patients:
 *   post:
 *     summary: Create a new patient
 *     description: Add a patient to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               dob:
 *                 type: string
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *               emergencyContact:
 *                 type: string
 *     responses:
 *       201:
 *         description: Patient created
 */
router.post("/", authenticate, validatePatient, patientsController.createPatient);


// PUT update patient
/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update a patient by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               dob:
 *                 type: string
 *               gender:
 *                 type: string
 *               address:
 *                 type: string
 *               emergencyContact:
 *                 type: string
 *     responses:
 *       204:
 *         description: Patient updated
 *       404:
 *         description: Patient not found
 */
router.put("/:id", authenticate, validatePatient, patientsController.updatePatient);


// DELETE patient
/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete a patient by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Patient deleted
 *       404:
 *         description: Patient not found
 */
router.delete("/:id", authenticate, patientsController.deletePatient);

module.exports = router;
