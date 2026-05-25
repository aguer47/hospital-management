const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

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
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const patients = await db
      .collection("patients")
      .find()
      .toArray();

    res.status(200).json(patients);
  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


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
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid patient ID"
      });
    }

    const db = getDB();

    const patient = await db
      .collection("patients")
      .findOne({ _id: new ObjectId(id) });

    if (!patient) {
      return res.status(404).json({
        message: "Patient not found"
      });
    }

    res.status(200).json(patient);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


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
 *               name:
 *                 type: string
 *                 
 *               age: 
 *                 type: number
 *                 
 *               gender:
 *                 type: string
 *                 
 *               disease:
 *                 type: string
 *                 
 *     responses:
 *       201:
 *         description: Patient created successfully
 */
router.post("/", async (req, res) => {
  try {
    const { name, age, gender, disease } = req.body;

    if (!name || !age || !gender || !disease) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const db = getDB();

    const result = await db.collection("patients").insertOne({
      name,
      age,
      gender,
      disease
    });

    res.status(201).json(result);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


// PUT update patient
/**
 * @swagger
 * /patients/{id}:
 *   put:
 *     summary: Update a patient
 *     description: Update a patient's information
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient updated successfully
 */
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid patient ID"
      });
    }

    const db = getDB();

    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: req.body
      }
    );

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


// DELETE patient
/**
 * @swagger
 * /patients/{id}:
 *   delete:
 *     summary: Delete a patient
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Patient deleted successfully
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid patient ID"
      });
    }

    const db = getDB();

    const result = await db.collection("patients").deleteOne({
      _id: new ObjectId(id)
    });

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});

module.exports = router;