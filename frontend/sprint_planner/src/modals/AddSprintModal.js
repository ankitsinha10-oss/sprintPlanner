import React, { useState } from 'react';
import axios from 'axios';

const AddSprintModal = ({ show, onClose, onSprintAdded }) => {
  const [formData, setFormData] = useState({
    sprintname: '',
    goal: '',
    startDate: '',
    endDate: '',
    status: 'planning',
    employees: []
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/sprint', formData);
      // Notify parent to refresh list
      onSprintAdded(response.data);
      // Reset form and close
      setFormData({ sprintname: '', goal: '', startDate: '', endDate: '', status: 'planning' });
      onClose();
    } catch (error) {
      console.error("Error adding sprint:", error);
      alert("Failed to add sprint. Check console.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold">Create New Sprint</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Sprint Name</label>
                <input 
                  type="text" 
                  name="sprintname" 
                  className="form-control" 
                  placeholder="e.g. Q1 Mobile App MVP"
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Goal</label>
                <textarea 
                  name="goal" 
                  className="form-control" 
                  rows="2"
                  placeholder="What is the objective of this sprint?"
                  onChange={handleInputChange}
                ></textarea>
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Start Date</label>
                  <input type="date" name="startDate" className="form-control" onChange={handleInputChange} />
                </div>
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">End Date</label>
                  <input type="date" name="endDate" className="form-control" onChange={handleInputChange} />
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Initial Status</label>
                <select name="status" className="form-select" onChange={handleInputChange} value={formData.status}>
                  <option value="planning">Planning</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-dark rounded-pill px-4">Create Sprint</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddSprintModal;