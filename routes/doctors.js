const express = require("express");
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

const router = express.Router();


/**
 * @swagger
 * /doctors:
 *   get:
 *     summary: Get all doctors
 *     description: Returns all doctors
 *     responses:
 *       200:
 *         description: Success
 */
router.get("/", async (req, res) => {
  try {
    const db = getDB();

    const doctors = await db
      .collection("doctors")
      .find()
      .toArray();

    res.status(200).json(doctors);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


/**
 * @swagger
 * /doctors/{id}:
 *   get:
 *     summary: Get doctor by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor found
 *       404:
 *         description: Doctor not found
 */
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid doctor ID"
      });
    }

    const db = getDB();

    const doctor = await db
      .collection("doctors")
      .findOne({ _id: new ObjectId(id) });

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found"
      });
    }

    res.status(200).json(doctor);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


/**
 * @swagger
 * /doctors:
 *   post:
 *     summary: Create a new doctor
 *     description: Add a doctor to the database
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
 *               specialty:
 *                 type: string
 *                 
 *               department:
 *                 type: string
 *                 
 *     responses:
 *       201:
 *         description: Doctor created successfully
 */
router.post("/", async (req, res) => {
  try {
    const { name, specialty, department } = req.body;

    if (!name || !specialty || !department) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const db = getDB();

    const result = await db.collection("doctors").insertOne({
      name,
      specialty,
      department
    });

    res.status(201).json(result);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
});


/**
 * @swagger
 * /doctors/{id}:
 *   put:
 *     summary: Update a doctor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor updated successfully
 */
router.put("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid doctor ID"
      });
    }

    const db = getDB();

    const result = await db.collection("doctors").updateOne(
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


/**
 * @swagger
 * /doctors/{id}:
 *   delete:
 *     summary: Delete a doctor
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Doctor deleted successfully
 */
router.delete("/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid doctor ID"
      });
    }

    const db = getDB();

    const result = await db.collection("doctors").deleteOne({
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