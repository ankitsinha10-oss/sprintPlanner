import mongoose from "mongoose";

const sprintSchema = new mongoose.Schema(
  {
    sprintId: {
      type: Number,
      unique: true,
    },
    sprintname: {
      type: String,
      required: true,
    },
    goal: {
      type: String,
    },
    employees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee" 
      }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
    },
    startDate: {
        type: Date,
    },
     endDate: {
        type: Date,
    },
     status: {
        type: String,
        enum: ["planning", "ongoing", "blocked", "completed"],
        default: "planning", 
        lowercase: true,     
    }
  },
  
);
export default mongoose.model("Sprint", sprintSchema, "sprints");