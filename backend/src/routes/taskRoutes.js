import express from "express";
import Task from "../models/Task.js";
import mongoose from "mongoose";

const router = express.Router();

// router.post("/", async (req, res) => {
// const count = await Task.countDocuments();
// const taskId = count + 1;
// const taskIds = (req.body.sprint)
//       .filter(id => id.length === 24)
//       .map(id => new mongoose.Types.ObjectId(id));

//   const task = await Task.create({
//   ...req.body,
//   taskId: taskId
// });

// const task_sprint = await Task.findById(req.params.id)
//       .populate("sprint"); 


// res.json(task); 
// });

router.post("/", async (req, res) => {
  try {

    console.log("--- New Task Request Received ---");
    console.log("Request Body:", req.body);

    const count = await Task.countDocuments();
    const lastTask = await Task.findOne().sort({ taskId: -1 });
    // const taskId = count + 1;
    const nextId = lastTask ? lastTask.taskId + 1 : 1;

    // Remove the filter/map logic here. req.body.sprint is just an ID string.
    const task = await Task.create({
      ...req.body,
      taskId: nextId
    });
    console.log("Task Created in DB (Raw):", task);

    // req.params.id doesn't exist in a POST / route. 
    // If you want to return the populated task, do this:
    const populatedTask = await Task.findById(task._id).populate("assignedTo");

console.log("Populated Task (Sending to Frontend):", populatedTask);

    res.json(populatedTask); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// router.get("/", async (req, res) => {
//   const { sprintId } = req.query;
//   const query = sprintId ? { sprint: sprintId } : {};
//   const task = await task.find(query).populate("assignedTo");
// console.log(`GET Request: Found ${tasks.length} tasks for Sprint: ${sprintId || 'All'}`);  res.json(task);
// });
// Inside taskRoutes.js
router.get("/", async (req, res) => {
  try {
    const { sprintId } = req.query;
    // Use the Uppercase 'Task' Model
    const query = sprintId ? { sprint: sprintId } : {};
    const tasks = await Task.find(query).populate("assignedTo");
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 1. UPDATE TASK
router.put("/:id", async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true })
      .populate('assignedTo'); // Important to keep the name visible on the board
    res.json(updatedTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// 2. DELETE TASK
router.delete("/:id", async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;