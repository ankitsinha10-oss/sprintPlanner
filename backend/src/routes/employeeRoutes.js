import express from "express";
import Employee from "../models/Employee.js";

const router = express.Router();

router.post("/", async (req, res) => {
const count = await Employee.countDocuments();
const employeeId = count + 1;

  const employee = await Employee.create({
  ...req.body,
  employeeId: employeeId
});
res.json(employee); 
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


router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});


export default router;