import React, { useState } from 'react';
import axios from 'axios';

const AddEmployeeModal = ({ show, onClose, onEmployeeAdded }) => {
  const [formData, setFormData] = useState({
  name: '',      // Changed from 'Employeename' to 'name'
  email: '',
  role: '',      // Changed from 'position' to 'role'
  startDate: '',
  status: 'active'
});

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/employees', formData);
      // Notify parent to refresh list
      onEmployeeAdded(response.data);
      // Reset form and close
      setFormData({ name: '', email: '', position: '', startDate: '', status: 'active' });
      onClose();
    } catch (error) {
      console.error("Error adding employee:", error);
      alert("Failed to add employee. Check console.");
    }
  };

  if (!show) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content border-0 shadow-lg">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold">Create New Employee</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Employee Name</label>
                <input 
                  type="text" 
                  name="name" 
                  className="form-control" 
                  placeholder="e.g. John Doe"
                  value={formData.name}
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Employee Email</label>
                <input 
                  type="email" 
                  name="email" 
                  className="form-control" 
                  placeholder="e.g. john.doe@example.com"
                  onChange={handleInputChange} 
                  required 
                />
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Role</label>
                <input 
                  type="text" 
                  name="role"
                  className="form-control" 
                  placeholder="e.g. Software Engineer"
                  value={formData.role}
                  onChange={handleInputChange} 
                  required 
                />
              </div>
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label fw-semibold">Start Date</label>
                  <input type="date" name="startDate" className="form-control" onChange={handleInputChange} />
                </div>
                
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Initial Status</label>
                <select name="status" className="form-select" onChange={handleInputChange} value={formData.status}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
            <div className="modal-footer border-0">
              <button type="button" className="btn btn-light rounded-pill px-4" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-dark rounded-pill px-4">Create Employee</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;