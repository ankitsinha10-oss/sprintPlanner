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

router.get("/", async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});


export default router;