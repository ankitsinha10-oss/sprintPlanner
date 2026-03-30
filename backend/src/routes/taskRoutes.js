import express from "express";
import Task from "../models/Task.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/", async (req, res) => {
const count = await Task.countDocuments();
const taskId = count + 1;
const taskIds = (req.body.sprint)
      .filter(id => id.length === 24)
      .map(id => new mongoose.Types.ObjectId(id));

  const task = await Task.create({
  ...req.body,
  taskId: taskId
});

const task_sprint = await Task.findById(req.params.id)
      .populate("sprint"); 


res.json(task); 
});

router.get("/", async (req, res) => {
  const task = await task.find();
  res.json(task);
});


export default router;