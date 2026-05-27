// Controllers for managing doctor records
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// GET - Get a list of all doctors in the system
const getAllDoctors = async (req, res) => {
  console.log("Fetching all doctors from database...");
  try {
    const db = getDB();
    const doctors = await db.collection("doctors").find().toArray();
    res.status(200).json(doctors);
  } catch (error) {
    console.error("Error in getAllDoctors:", error.message);
    res.status(500).json({ message: "Failed to retrieve doctors list." });
  }
};

// GET - Get one doctor by their ID
const getDoctorById = async (req, res) => {
  const id = req.params.id;
  console.log(`Searching for doctor with ID: ${id}`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format provided." });
    }
    
    const db = getDB();
    const doctor = await db.collection("doctors").findOne({ _id: new ObjectId(id) });
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found in our records." });
    }
    
    res.status(200).json(doctor);
  } catch (error) {
    console.error("Error in getDoctorById:", error.message);
    res.status(500).json({ message: "Error searching for doctor." });
  }
};

// POST - Add a new doctor to the system
const createDoctor = async (req, res) => {
  console.log("Adding a new doctor to the system...");
  try {
    const db = getDB();
    const result = await db.collection("doctors").insertOne(req.body);
    
    if (result.acknowledged) {
      res.status(201).json(result);
    } else {
      res.status(500).json({ message: "Could not add the doctor." });
    }
  } catch (error) {
    console.error("Error in createDoctor:", error.message);
    res.status(500).json({ message: "Server error while creating doctor record." });
  }
};

// PUT - Update doctor details
const updateDoctor = async (req, res) => {
  const id = req.params.id;
  console.log(`Updating record for doctor ID: ${id}`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    
    const db = getDB();
    const result = await db.collection("doctors").updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Doctor record not found." });
    }
    
    res.status(204).send(); 
  } catch (error) {
    console.error("Error in updateDoctor:", error.message);
    res.status(500).json({ message: "Failed to update doctor details." });
  }
};

// DELETE - Remove a doctor from the system
const deleteDoctor = async (req, res) => {
  const id = req.params.id;
  console.log(`Removing doctor ID: ${id}`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    
    const db = getDB();
    const result = await db.collection("doctors").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Doctor not found to delete." });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteDoctor:", error.message);
    res.status(500).json({ message: "Could not delete doctor record." });
  }
};

module.exports = {
  getAllDoctors,
  getDoctorById,
  createDoctor,
  updateDoctor,
  deleteDoctor
};
