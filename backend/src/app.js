import express from "express";
import cors from "cors";

import employeeRoutes from "./routes/employeeRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());


app.use("/employees", employeeRoutes);
app.use("/sprint", sprintRoutes);
app.use("/task", taskRoutes);

app.get("/", (req, res) => {
 res.send("API is running");
});

app.get("/test", (req, res) => {
  res.json({ message: "MongoDB Atlas working " });
});
export default app;

