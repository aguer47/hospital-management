// Controllers for managing hospital departments
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// GET - List all departments in the hospital
const getAllDepartments = async (req, res) => {
  console.log("Getting all departments...");
  try {
    const db = getDB();
    const departments = await db.collection("departments").find().toArray();
    res.status(200).json(departments);
  } catch (error) {
    console.error("Error fetching departments:", error.message);
    res.status(500).json({ message: "Could not get the list of departments." });
  }
};

// GET - Find a department using its ID
const getDepartmentById = async (req, res) => {
  const id = req.params.id;
  console.log(`Looking for department with ID: ${id}`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "The provided ID format is not valid." });
    }
    
    const db = getDB();
    const department = await db.collection("departments").findOne({ _id: new ObjectId(id) });
    
    if (!department) {
      return res.status(404).json({ message: "No department found with that ID." });
    }
    
    res.status(200).json(department);
  } catch (error) {
    console.error("Error finding department:", error.message);
    res.status(500).json({ message: "Something went wrong while searching." });
  }
};

// POST - Add a new department
const createDepartment = async (req, res) => {
  console.log("Adding a new department...");
  try {
    const db = getDB();
    const result = await db.collection("departments").insertOne(req.body);
    
    if (result.acknowledged) {
      res.status(201).json(result);
    } else {
      res.status(500).json({ message: "Failed to add department." });
    }
  } catch (error) {
    console.error("Error creating department:", error.message);
    res.status(500).json({ message: "Could not create the new department record." });
  }
};

// PUT - Update department details
const updateDepartment = async (req, res) => {
  const id = req.params.id;
  console.log(`Updating info for department ID: ${id}`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    
    const db = getDB();
    const result = await db.collection("departments").updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Department not found to update." });
    }
    
    res.status(204).send(); 
  } catch (error) {
    console.error("Error updating department:", error.message);
    res.status(500).json({ message: "Could not update department details." });
  }
};

// DELETE - Delete a department
const deleteDepartment = async (req, res) => {
  const id = req.params.id;
  console.log(`Deleting department with ID: ${id}`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    
    const db = getDB();
    const result = await db.collection("departments").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Department not found to delete." });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting department:", error.message);
    res.status(500).json({ message: "Failed to delete department." });
  }
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
};
