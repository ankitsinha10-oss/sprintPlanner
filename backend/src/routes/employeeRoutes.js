import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const count = await Employee.countDocuments();
    
      const lastEmployee = await Employee.findOne().sort({ employeeId: -1 });
    
    const nextId = lastEmployee ? lastEmployee.employeeId + 1 : 1;

    const employee = await Employee.create({
      ...req.body,
      employeeId: nextId
    });
    res.status(201).json(employee); 
  } catch (error) {
    console.error("Create Error:", error);
    res.status(400).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

// Get a single employee by ID
router.get("/:id", async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) return res.status(404).json({ message: "Employee not found" });
    res.json(employee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// Update employee role
router.patch("/:id/role", async (req, res) => {
  try {
    const { role } = req.body;
    const updatedEmployee = await Employee.findByIdAndUpdate(
      req.params.id,
      { role: role },
      { returnDocument: 'after'}
    );
    res.json(updatedEmployee);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


export default router;