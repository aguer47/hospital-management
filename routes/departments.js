const express = require("express");
const departmentsController = require("../controllers/departments");
const validateDepartment = require("../middleware/validatedepartment");
const authenticate = require("../middleware/authenticate");

const router = express.Router();


/**
 * @swagger
 * /departments:
 *   get:
 *     summary: Get all departments
 *     description: Returns all departments
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", departmentsController.getAllDepartments);


/**
 * @swagger
 * /departments/{id}:
 *   get:
 *     summary: Get department by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Department found
 *       404:
 *         description: Department not found
 */
router.get("/:id", departmentsController.getDepartmentById);


/**
 * @swagger
 * /departments:
 *   post:
 *     summary: Create a new department
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               head:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created
 */
router.post("/", authenticate, validateDepartment, departmentsController.createDepartment);


/**
 * @swagger
 * /departments/{id}:
 *   put:
 *     summary: Update a department by ID
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
 *               name:
 *                 type: string
 *               location:
 *                 type: string
 *               head:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       204:
 *         description: Department updated
 *       404:
 *         description: Department not found
 */
router.put("/:id", authenticate, validateDepartment, departmentsController.updateDepartment);


/**
 * @swagger
 * /departments/{id}:
 *   delete:
 *     summary: Delete a department by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Department deleted
 *       404:
 *         description: Department not found
 */
router.delete("/:id", authenticate, departmentsController.deleteDepartment);

module.exports = router;
