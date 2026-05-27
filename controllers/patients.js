// Controllers for managing patient records
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// GET all patients from the database
const getAllPatients = async (req, res) => {
  console.log("Fetching all patients...");
  try {
    const db = getDB();
    const patients = await db.collection("patients").find().toArray();
    res.status(200).json(patients);
  } catch (error) {
    console.error("Error fetching patients:", error.message);
    res.status(500).json({ message: "Something went wrong while fetching patients." });
  }
};

// GET a single patient by their MongoDB ID
const getPatientById = async (req, res) => {
  const id = req.params.id;
  console.log(`Fetching patient with ID: ${id}`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "That is not a valid patient ID format." });
    }
    
    const db = getDB();
    const patient = await db.collection("patients").findOne({ _id: new ObjectId(id) });
    
    if (!patient) {
      return res.status(404).json({ message: "We couldn't find a patient with that ID." });
    }
    
    res.status(200).json(patient);
  } catch (error) {
    console.error("Error fetching patient:", error.message);
    res.status(500).json({ message: "Error occurred while looking for the patient." });
  }
};

// POST - Create a new patient record
const createPatient = async (req, res) => {
  console.log("Creating a new patient...");
  try {
    const db = getDB();
    const result = await db.collection("patients").insertOne(req.body);
    
    if (result.acknowledged) {
      res.status(201).json(result);
    } else {
      res.status(500).json({ message: "Failed to create the patient record." });
    }
  } catch (error) {
    console.error("Error creating patient:", error.message);
    res.status(500).json({ message: "Error occurred while creating the patient." });
  }
};

// PUT - Update an existing patient's information
const updatePatient = async (req, res) => {
  const id = req.params.id;
  console.log(`Updating patient with ID: ${id}`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    
    const db = getDB();
    const result = await db.collection("patients").updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Patient not found to update." });
    }
    
    res.status(204).send(); // Success but no content to return
  } catch (error) {
    console.error("Error updating patient:", error.message);
    res.status(500).json({ message: "Error occurred while updating the patient." });
  }
};

// DELETE - Remove a patient from the database
const deletePatient = async (req, res) => {
  const id = req.params.id;
  console.log(`Deleting patient with ID: ${id}`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    
    const db = getDB();
    const result = await db.collection("patients").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Patient not found to delete." });
    }
    
    res.status(204).send(); // Successfully deleted
  } catch (error) {
    console.error("Error deleting patient:", error.message);
    res.status(500).json({ message: "Error occurred while deleting the patient." });
  }
};

module.exports = {
  getAllPatients,
  getPatientById,
  createPatient,
  updatePatient,
  deletePatient
};
