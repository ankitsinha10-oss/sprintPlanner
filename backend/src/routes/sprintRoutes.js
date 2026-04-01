import express from "express";
import Sprint from "../models/Sprint.js";
import mongoose from "mongoose";

const router = express.Router();

// new mongoose.Types.ObjectId("")
router.post("/", async (req, res) => {
  // const count = await Sprint.countDocuments();
  const lastSprint = await Sprint.findOne().sort({ sprintId: -1 });

  // 2. If no sprints exist (empty DB), start at 1. 
// Otherwise, take the highest number (e.g., 5) and add 1 to get 6.
const nextId = lastSprint ? lastSprint.sprintId + 1 : 1;

  // const sprintId = count + 1;
let employeeIds = [];
    if (req.body.employees && Array.isArray(req.body.employees)) {
      employeeIds = req.body.employees
        .filter(id => id && id.length === 24)
        .map(id => new mongoose.Types.ObjectId(id));
    }
  
  const sprint = await Sprint.create({
  ...req.body,
  sprintId: nextId,
  employees: employeeIds
  });

  // const sprint_emp = await Sprint.findById(req.params.id).populate("employees"); 

  res.json(sprint); 
});

// Get a single sprint by ID
router.get('/:id', async (req, res) => {
    try {
        // .populate("employees") follows the "ref" in your Model 
        // to fetch Name, Email, and Role automatically
        const sprint = await Sprint.findById(req.params.id).populate("employees"); 
        
        if (!sprint) {
            return res.status(404).json({ message: "Sprint not found" });
        }
        
        res.json(sprint);
    } catch (error) {
        // If the ID is malformed or database is down
        res.status(500).json({ message: "Error fetching sprint", error: error.message });
    }
});

// Add an employee to a sprint
router.put("/:id/add-employee", async (req, res) => {
  try {
    const { employeeId } = req.body;
    
    // $addToSet ensures you don't add the same person twice
    const updatedSprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      { $addToSet: { employees: employeeId } },
      { new: true }
    ).populate("employees");

    res.json(updatedSprint);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/", async (req, res) => {
  const sprint = await Sprint.find();
  res.json(sprint);
});


// DELETE a sprint
router.delete("/:id", async (req, res) => {
  await Sprint.findByIdAndDelete(req.params.id);
  res.json({ message: "Sprint deleted" });
});

// UPDATE sprint status (for Mark Complete)
router.patch("/:id/status", async (req, res) => {
  const updated = await Sprint.findByIdAndUpdate(
    req.params.id, 
    { status: req.body.status }, 
    { new: true }
  ).populate("employees");
  res.json(updated);
});

// update the sprint
router.put("/:id", async (req, res) => {
  try {
    const updatedSprint = await Sprint.findByIdAndUpdate(
      req.params.id,
      {
        sprintname: req.body.sprintname,
        goal: req.body.goal,
        startDate: req.body.startDate,
        endDate: req.body.endDate
      },
      { new: true } // This returns the modified document rather than the original
    ).populate("employees"); // Populate if you need the team list back

    if (!updatedSprint) {
      return res.status(404).json({ message: "Sprint not found" });
    }

    res.json(updatedSprint);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

export default router;