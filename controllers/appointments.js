// Controllers for managing hospital appointments
const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// GET - Show all appointments
const getAllAppointments = async (req, res) => {
  console.log("Loading all appointments...");
  try {
    const db = getDB();
    const appointments = await db.collection("appointments").find().toArray();
    res.status(200).json(appointments);
  } catch (error) {
    console.error("Error loading appointments:", error.message);
    res.status(500).json({ message: "We had trouble loading the appointments list." });
  }
};

// GET - Find a specific appointment by ID
const getAppointmentById = async (req, res) => {
  const id = req.params.id;
  console.log(`Searching for appointment ${id}...`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    
    const db = getDB();
    const appointment = await db.collection("appointments").findOne({ _id: new ObjectId(id) });
    
    if (!appointment) {
      return res.status(404).json({ message: "No appointment found with that ID." });
    }
    
    res.status(200).json(appointment);
  } catch (error) {
    console.error("Error finding appointment:", error.message);
    res.status(500).json({ message: "Error occurred while searching." });
  }
};

// POST - Book a new appointment
const createAppointment = async (req, res) => {
  console.log("Booking a new appointment...");
  try {
    const db = getDB();
    const result = await db.collection("appointments").insertOne(req.body);
    
    if (result.acknowledged) {
      res.status(201).json(result);
    } else {
      res.status(500).json({ message: "Booking failed." });
    }
  } catch (error) {
    console.error("Error booking appointment:", error.message);
    res.status(500).json({ message: "Could not create the appointment." });
  }
};

// PUT - Reschedule or change appointment details
const updateAppointment = async (req, res) => {
  const id = req.params.id;
  console.log(`Updating appointment ${id}...`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    
    const db = getDB();
    const result = await db.collection("appointments").updateOne(
      { _id: new ObjectId(id) },
      { $set: req.body }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Appointment not found to update." });
    }
    
    res.status(204).send(); 
  } catch (error) {
    console.error("Error updating appointment:", error.message);
    res.status(500).json({ message: "Failed to update the appointment." });
  }
};

// DELETE - Cancel an appointment
const deleteAppointment = async (req, res) => {
  const id = req.params.id;
  console.log(`Cancelling appointment ${id}...`);
  
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    
    const db = getDB();
    const result = await db.collection("appointments").deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Appointment not found to cancel." });
    }
    
    res.status(204).send();
  } catch (error) {
    console.error("Error cancelling appointment:", error.message);
    res.status(500).json({ message: "Could not cancel the appointment." });
  }
};

module.exports = {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment
};
