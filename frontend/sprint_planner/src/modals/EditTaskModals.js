import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditTaskModal = ({ show, onClose, task, sprintEmployees, onTaskUpdated, onTaskDeleted }) => {
    const [formData, setFormData] = useState({
        taskname: '',
        desc: '',
        status: '',
        assignedTo: '',
        dueDate: ''
    });

    useEffect(() => {
        if (task) {
            setFormData({
                taskname: task.taskname || '',
                desc: task.desc || '',
                status: task.status || 'todo',
                assignedTo: task.assignedTo?._id || task.assignedTo || '',
                dueDate: task.dueDate ? task.dueDate.split('T')[0] : ''
            });
        }
    }, [task, show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.put(`http://localhost:8000/tasks/${task._id}`, formData);
            onTaskUpdated(res.data);
            onClose();
        } catch (err) {
            console.error("Update error:", err);
        }
    };

    const handleDelete = async () => {
        if (window.confirm("Delete this task?")) {
            try {
                await axios.delete(`http://localhost:8000/tasks/${task._id}`);
                onTaskDeleted(task._id);
                onClose();
            } catch (err) {
                console.error("Delete error:", err);
            }
        }
    };

    if (!show) return null;

    return (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow">
                    <div className="modal-header">
                        <h5 className="modal-title fw-bold">Edit Task</h5>
                        <button type="button" className="btn-close" onClick={onClose}></button>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Task Name</label>
                                <input type="text" name="taskname" className="form-control" value={formData.taskname} onChange={handleChange} required />
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Description</label>
                                <textarea name="desc" className="form-control" rows="2" value={formData.desc} onChange={handleChange}></textarea>
                            </div>
                            <div className="row">
                                <div className="col-6 mb-3">
                                    <label className="form-label small fw-bold">Status</label>
                                    <select name="status" className="form-select" value={formData.status} onChange={handleChange}>
                                        <option value="todo">To Do</option>
                                        <option value="inprogress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                                <div className="col-6 mb-3">
                                    <label className="form-label small fw-bold">Assignee</label>
                                    <select name="assignedTo" className="form-select" value={formData.assignedTo} onChange={handleChange}>
                                        <option value="">Unassigned</option>
                                        {sprintEmployees?.map(emp => (
                                            <option key={emp._id} value={emp._id}>{emp.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label small fw-bold">Due Date</label>
                                <input type="date" name="dueDate" className="form-control" value={formData.dueDate} onChange={handleChange} />
                            </div>
                        </div>
                        <div className="modal-footer d-flex justify-content-between">
                            <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>Delete Task</button>
                            <div>
                                <button type="button" className="btn btn-light me-2" onClick={onClose}>Cancel</button>
                                <button type="submit" className="btn btn-primary">Save Changes</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditTaskModal;