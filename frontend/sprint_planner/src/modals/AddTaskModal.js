import React, { useState } from 'react';
import axios from 'axios';

const AddTaskModal = ({ show, onClose, sprintId, sprintEmployees, initialStatus, onTaskAdded }) => {
  const [taskData, setTaskData] = useState({
    taskname: '',
    desc: '',
    assignedTo: '',
    status: initialStatus,
    dueDate: ''
  });

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/tasks', {
        ...taskData,
        sprint: sprintId,
        status: initialStatus // Ensures it lands in the column you clicked
      });
      onTaskAdded(res.data);
      onClose();
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h5 className="modal-title">Add Task to {initialStatus}</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label">Task Name</label>
                <input type="text" className="form-control" required onChange={(e) => setTaskData({...taskData, taskname: e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Assign To Member</label>
                <select className="form-select" required onChange={(e) => setTaskData({...taskData, assignedTo: e.target.value})}>
                  <option value="">Select a member...</option>
                  {sprintEmployees.map(emp => (
                    <option key={emp._id} value={emp._id}>{emp.name}</option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Due Date</label>
                <input type="date" className="form-control" onChange={(e) => setTaskData({...taskData, dueDate: e.target.value})} />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-light" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Task</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTaskModal;