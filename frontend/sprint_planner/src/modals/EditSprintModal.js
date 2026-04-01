import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditSprintModal = ({ show, onClose, sprint, onSprintUpdated }) => {
    const [formData, setFormData] = useState({
        sprintname: '',
        goal: '',
        startDate: '',
        endDate: ''
    });

    // Sync form data whenever the sprint prop changes or modal opens
    useEffect(() => {
        if (sprint) {
            setFormData({
                sprintname: sprint.sprintname || '',
                goal: sprint.goal || '',
                startDate: sprint.startDate ? sprint.startDate.split('T')[0] : '',
                endDate: sprint.endDate ? sprint.endDate.split('T')[0] : ''
            });
        }
    }, [sprint, show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8000/sprint/${sprint._id}`, formData);
            onSprintUpdated(res.data); // Update the UI in the parent component
            onClose(); // Close the modal
        } catch (err) {
            console.error("Update error:", err);
            alert("Failed to update sprint details.");
        }
    };

    if (!show) return null;

    return (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                    <div className="modal-header bg-light">
                        <h5 className="modal-title fw-bold">Edit Sprint Settings</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body p-4">
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-muted">Sprint Name</label>
                                <input 
                                    type="text" 
                                    className="form-control" 
                                    name="sprintname" 
                                    value={formData.sprintname} 
                                    onChange={handleChange} 
                                    required 
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label fw-bold small text-muted">Sprint Goal</label>
                                <textarea 
                                    className="form-control" 
                                    name="goal" 
                                    rows="3" 
                                    value={formData.goal} 
                                    onChange={handleChange}
                                ></textarea>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label fw-bold small text-muted">Start Date</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        name="startDate" 
                                        value={formData.startDate} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label fw-bold small text-muted">End Date</label>
                                    <input 
                                        type="date" 
                                        className="form-control" 
                                        name="endDate" 
                                        value={formData.endDate} 
                                        onChange={handleChange} 
                                        required 
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer border-0 bg-light p-3">
                            <button type="button" className="btn btn-secondary px-4 rounded-pill" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn btn-primary px-4 rounded-pill">Save Changes</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditSprintModal;