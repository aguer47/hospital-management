const express = require("express");
const appointmentsController = require("../controllers/appointments");
const validateAppointment = require("../middleware/validateappointment");
const authenticate = require("../middleware/authenticate");

const router = express.Router();


/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Get all appointments
 *     description: Returns all appointments
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", appointmentsController.getAllAppointments);


/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Get appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Appointment found
 *       404:
 *         description: Appointment not found
 */
router.get("/:id", appointmentsController.getAppointmentById);


/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Create a new appointment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Appointment created
 */
router.post("/", authenticate, validateAppointment, appointmentsController.createAppointment);


/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Update an appointment by ID
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
 *               patientId:
 *                 type: string
 *               doctorId:
 *                 type: string
 *               date:
 *                 type: string
 *               time:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       204:
 *         description: Appointment updated
 *       404:
 *         description: Appointment not found
 */
router.put("/:id", authenticate, validateAppointment, appointmentsController.updateAppointment);


/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Delete an appointment by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Appointment deleted
 *       404:
 *         description: Appointment not found
 */
router.delete("/:id", authenticate, appointmentsController.deleteAppointment);

module.exports = router;
