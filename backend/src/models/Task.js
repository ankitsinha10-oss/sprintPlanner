import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    taskId: {
      type: Number,
      unique: true,
    },
    taskname: {
      type: String,
      required: true,
    },
    sprint: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sprint",
      required: true
  },
   // Link to the Employee (Assigned to)
    assignedTo: {

      type: mongoose.Schema.Types.ObjectId,

      ref: "Employee" // Make sure your Employee model is named "Employee"
  },
    desc: {
      type: String,
    },
    status: {

      type: String,

      enum: ['todo', 'inprogress', 'completed', 'overdue'],

      default: 'todo'
  },
    dueDate: {
        type: Date,
        default: Date.now
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    updatedAt: {
        type: Date,
    },
  }
);

export default mongoose.model("Task", taskSchema);