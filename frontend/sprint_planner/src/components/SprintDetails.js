import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AddTaskModal from '../modals/AddTaskModal';
import EditSprintModal from '../modals/EditSprintModal';
import EditTaskModal from '../modals/EditTaskModals';
import GanttChart from './GanttChart';

const SprintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [sprint, setSprint] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [allEmployees, setAllEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  // State to control the Task Modal visibility
  const [showTaskModal, setShowTaskModal] = useState(false);
  // State to remember which column we are adding to
const [selectedStatus, setSelectedStatus] = useState('todo');

  const [showEditTaskModal, setShowEditTaskModal] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);



// 1. DELETE SPRINT
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this sprint? This cannot be undone.")) {
      try {
        await axios.delete(`http://localhost:8000/sprint/${id}`);
        alert("Sprint deleted successfully");
        navigate('/sprints'); // Go back to list
      } catch (err) {
        console.error("Delete error:", err);
      }
    }
  };

  // 2. MARK AS COMPLETE
  const handleMarkComplete = async () => {
    try {
      const res = await axios.patch(`http://localhost:8000/sprint/${id}/status`, {
        status: 'completed'
      });
      setSprint(res.data); // Update UI immediately
      alert("Sprint marked as completed!");
    } catch (err) {
      console.error("Update error:", err);
    }
  };

  // 3. EDIT SPRINT (Placeholder for now)
  const handleEdit = () => {
    alert("ruko modals bnane to do wait");
    setShowEditModal(true)
  };

  const onSprintUpdated = (updatedSprint) => {
    setSprint(updatedSprint); 
    // Updates UI with new data from modal
  };


  // 3. TASK HANDLERS
  const handleOpenEditTaskModal = (task) => {
    setTaskToEdit(task);
    setShowEditTaskModal(true);
  };

  const onTaskUpdated = (updatedTask) => {
    setTasks(tasks.map(t => t._id === updatedTask._id ? updatedTask : t));
  };


  const onTaskDeleted = (deletedId) => {
    setTasks(tasks.filter(t => t._id !== deletedId));
  };

  console.log("Loading SprintDetails for ID:", id); 

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/sprint/${id}`);
        setSprint(res.data);
        const empRes = await axios.get(`http://localhost:8000/employees`);
        setAllEmployees(empRes.data);
        const taskRes = await axios.get(`http://localhost:8000/tasks?sprintId=${id}`);
        
      setTasks(taskRes.data);
      } catch (err) {
        console.error("Fetch error:", err);
      }
    };
    if (id) fetchDetails();
  }, [id]);

if (!sprint) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2">Loading sprint details...</p>
      </div>
    );
  }

  const addEmployeeToSprint = async (empId) => {
    try {
      // We send a PUT request to the backend with the Employee's ID
      const response = await axios.put(`http://localhost:8000/sprint/${id}/add-employee`, {
        employeeId: empId
      });
      
      // We update the local state with the new data from the server
      // This makes the person jump from the "Add" list to the "Assigned" list instantly
      setSprint(response.data);
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Could not add employee. Make sure the backend route exists.");
    }
  };

 const delEmployeeToSprint = async (empId) => {
    try {
      // We send a PUT request to the backend with the Employee's ID
      const response = await axios.put(`http://localhost:8000/sprint/${id}/remove-employee`, {
        employeeId: empId
      });
      
      // We update the local state with the new data from the server
      // This makes the person jump from the "Add" list to the "Assigned" list instantly
      setSprint(response.data);
    } catch (err) {
      console.error("Error adding employee:", err);
      alert("Could not delete employee. Make sure the backend route exists.");
    }
  };



const handleOpenTaskModal = (status) => {
  setSelectedStatus(status); // Set status to 'todo', 'inprogress', or 'completed'
  setShowTaskModal(true);    // Open the modal
};


// Logic to calculate progress per employee based on tasks
  const getEmployeeTaskStats = (empId) => {
    const empTasks = tasks.filter(t => t.assignedTo?._id === empId || t.assignedTo === empId);
    const total = empTasks.length;
    const completed = empTasks.filter(t => t.status === 'completed').length;
    const percent = total > 0 ? (completed / total) * 100 : 0;
    
    let color = 'bg-danger';
    if (percent >= 40 && percent < 80) color = 'bg-warning';
    if (percent >= 80) color = 'bg-success';

    return { completed, total, percent, color};
  };

  // Handler to update the global role of an employee
  const handleChangeRole = async (empId) => {
    const newRole = prompt("Enter new role for this employee:");
    if (!newRole) return;
    try {
      await axios.patch(`http://localhost:8000/employees/${empId}/role`, { role: newRole });
      const res = await axios.get(`http://localhost:8000/sprint/${id}`);
      setSprint(res.data);
    } catch (err) {
      console.error("Error updating role:", err);
    }
  };


  return (
    <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="d-flex align-items-center">
          <Link to="/sprints" className="text-decoration-none text-dark me-3">← All sprints</Link>
          <h2 className="mb-0 fw-bold">{sprint.sprintname}</h2>
          <span className="badge bg-success-subtle text-success ms-3 rounded-pill px-3">
            {sprint.status}
          </span>
        </div>
        <div className="btn-group">
          <button 
            className="btn btn-outline-secondary btn-sm px-3" 
            onClick={handleEdit}
          >
            Edit sprint
          </button>
          <button 
            className="btn btn-outline-secondary btn-sm px-3 mx-2" 
            onClick={handleMarkComplete}
            disabled={sprint.status === 'completed'} // Disable if already done 
          >
            Mark complete
          </button>
          <button 
            className="btn btn-outline-danger btn-sm px-3" 
            onClick={handleDelete}
          >
            Delete
          </button> </div>
      </div>
      
{/* 1. THE GLOBAL + ADD TASK BUTTON (Sit here!) */}
      <button 
        className="btn btn-white text-dark d-flex flex-column align-items-center justify-content-center p-3 rounded-3 border fw-bold shadow-sm"
        style={{ width: '80px', height: '100px', paddingBottom: '10px', borderStyle: 'solid' }}
        onClick={() => handleOpenTaskModal('todo')} // You can default it to 'todo'
      >
        <span className="fs-3">+ </span>
        <span className="small">Add task</span>
      </button>

<ul className="nav nav-tabs border-0 mb-4">
        {['overview', 'team', 'board', 'gantt'].map(tab => (
          <li className="nav-item" key={tab}>
            <button 
              className={`nav-link border-0 text-capitalize fw-medium ${activeTab === tab ? 'active border-bottom border-primary border-3' : 'text-secondary'}`}
              
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'overview' && (
  <div className="animate__animated animate__fadeIn">
    {/* TOP SECTION: Goal and Dates */}
    <div className="row g-4 mb-4">
      <div className="col-lg-8">
        <div className="card border-0 shadow-sm p-4 h-100 rounded-4">
          <h6 className="text-uppercase text-muted fw-bold small mb-3">Sprint Goal</h6>
          <p className="fs-5 text-dark" style={{ lineHeight: '1.6' }}>
            {sprint.goal || "No goal defined for this sprint."}
          </p>
        </div>
      </div>

      <div className="col-lg-4">
        <div className="card border-0 shadow-sm p-4 h-100 rounded-4 position-relative">
          <div className="row h-100">
            <div className="col-7">
              <div className="mb-4">
                <small className="text-muted d-block mb-1">Start Date</small>
                <h6 className="fw-bold mb-0">{new Date(sprint.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</h6>
              </div>
              <div>
                <small className="text-muted d-block mb-1">End Date</small>
                <h6 className="fw-bold mb-0">{new Date(sprint.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</h6>
              </div>
            </div>
            
            {/* The "Days Remaining" Box */}
            <div className="col-5 d-flex align-items-center">
              <div className="w-100 p-3 rounded-4 text-center" style={{ backgroundColor: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                <h2 className="fw-bold text-primary mb-0">
                  {Math.max(0, Math.ceil((new Date(sprint.endDate) - new Date()) / (1000 * 60 * 60 * 24)))}
                </h2>
                <small className="text-primary fw-medium d-block" style={{ fontSize: '11px', lineHeight: '1.2' }}>days remaining</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* METRIC CARDS SECTION */}
    <div className="row g-4 mb-4">
      {[
        { label: 'Total tasks', val: tasks.length, sub: `across ${sprint.employees.length} members`, color: 'text-dark' },
        { label: 'Completed', val: tasks.filter(t => t.status === 'completed').length, sub: `${Math.round((tasks.filter(t => t.status === 'completed').length / (tasks.length || 1)) * 100)}% of sprint`, color: 'text-success' },
        { label: 'In progress', val: tasks.filter(t => t.status === 'inprogress').length, sub: 'due this week', color: 'text-warning' },
        { label: 'Overdue', val: tasks.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'completed').length, sub: 'past due date', color: 'text-danger' }
      ].map((card, idx) => (
        <div className="col-md-3" key={idx}>
          <div className="card border-0 shadow-sm p-4 rounded-4 h-100 bg-white">
            <small className="text-muted text-uppercase fw-bold mb-2" style={{ fontSize: '11px', letterSpacing: '0.5px' }}>{card.label}</small>
            <h1 className={`fw-bold mb-1 ${card.color}`}>{card.val}</h1>
            <small className="text-muted">{card.sub}</small>
          </div>
        </div>
      ))}
    </div>

    {/* PROGRESS BY MEMBER SECTION */}
    <div className="card border-0 shadow-sm p-4 rounded-4 bg-white">
      <h6 className="text-uppercase text-muted fw-bold small mb-4">Progress by Member</h6>
      <div className="px-2">
        {sprint.employees.map(emp => {
          const stats = getEmployeeTaskStats(emp._id);
          // Determine bar color based on your reference image colors
          const barColor = stats.percent >= 80 ? '#10B981' : stats.percent >= 50 ? '#B45309' : '#B91C1C';
          
          return (
            <div key={emp._id} className="row align-items-center mb-4">
              <div className="col-md-2">
                <span className="fw-semibold text-dark">{emp.name}</span>
              </div>
              <div className="col-md-9">
                <div className="progress rounded-pill" style={{ height: '10px', backgroundColor: '#F3F4F6' }}>
                  <div 
                    className="progress-bar rounded-pill" 
                    style={{ 
                      width: `${stats.percent}%`, 
                      backgroundColor: barColor,
                      transition: 'width 1.5s cubic-bezier(0.4, 0, 0.2, 1)' 
                    }}
                  ></div>
                </div>
              </div>
              <div className="col-md-1 text-end text-muted fw-medium">
                {Math.round(stats.percent)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
)}

     {activeTab === 'team' && (
          <div className="py-2">
            {/* Header section with Stats */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0">Assigned members</h5>
              <span className="text-muted small">
                {sprint.employees.length} of {allEmployees.length} company employees
              </span>
            </div>

            <div className="assigned-members-list">
              {sprint.employees && sprint.employees.length > 0 ? (
                sprint.employees.map(emp => {
                  const stats = getEmployeeTaskStats(emp._id);
                  return (
                    <div key={emp._id} className="card border-light shadow-sm mb-3 rounded-4">
                      <div className="card-body p-3 d-flex align-items-center">
                        
                        {/* Avatar & Info Section */}
                        <div className="d-flex align-items-center" style={{ flex: '2' }}>
                          <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" 
                               style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                            {emp.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="text-truncate">
                            <h6 className="mb-0 fw-bold text-dark">{emp.name}</h6>
                            <small className="text-muted text-truncate d-block">
                              {emp.email} · {emp.role}
                            </small>
                          </div>
                        </div>

                        {/* Role Badge Section */}
                        <div className="px-3 text-center" style={{ flex: '1' }}>
                          <span className="badge rounded-pill bg-primary-subtle text-primary px-3 fw-medium">
                            {emp.role}
                          </span>
                        </div>

                        {/* Task Progress Bar Section */}
                        <div className="d-flex align-items-center px-4" style={{ flex: '2' }}>
                          <div className="progress w-100 rounded-pill bg-light me-3" style={{ height: '8px' }}>
                            <div 
                              className={`progress-bar rounded-pill ${stats.color}`} 
                              style={{ width: `${stats.percent}%`, transition: 'width 0.5s ease' }}
                            ></div>
                          </div>
                          <small className="fw-bold text-secondary" style={{ minWidth: '40px' }}>
                            {stats.completed}/{stats.total}
                          </small>
                        </div>

                        {/* Action Buttons Section */}
                        <div className="d-flex gap-2 justify-content-end" style={{ flex: '1.5' }}>
                          <button 
                            className="btn btn-outline-dark btn-sm rounded-3 px-3 fw-semibold"
                            onClick={() => handleChangeRole(emp._id)}
                          >
                            Change role
                          </button>
                          <button 
                            className="btn btn-outline-secondary btn-sm rounded-3 px-3 fw-semibold"
                            onClick={() => delEmployeeToSprint(emp._id)}
                          >
                            Remove
                          </button>
                        </div>

                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-muted italic">No one assigned yet.</p>
              )}
            </div>

            <hr className="my-5 text-secondary opacity-25" />

            {/* SECTION 2: Add New Members */}
            <div>
              <h5 className="fw-bold mb-3 text-dark">Add to team</h5>
              <p className="small text-muted mb-3">Select an employee from the company directory to add to this sprint.</p>
              
              <div className="list-group border rounded-3 overflow-auto" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {allEmployees.filter(emp => !sprint.employees.some(existing => existing._id === emp._id))
                  .map(emp => (
                    <button 
                      key={emp._id}
                      className="list-group-item list-group-item-action d-flex justify-content-between align-items-center py-3 border-light"
                      onClick={() => addEmployeeToSprint(emp._id)}
                    >
                      <div className="d-flex align-items-center">
                        <div className="bg-light text-dark rounded-circle d-flex align-items-center justify-content-center me-3 border" style={{width: '32px', height: '32px', fontSize: '0.8rem'}}>
                          {emp.name.charAt(0)}
                        </div>
                        <span>{emp.name} <small className="text-muted ms-2">({emp.role})</small></span>
                      </div>
                      <span className="badge bg-primary rounded-pill px-3">+ Add</span>
                    </button>
                ))}
              </div>
            </div>
          </div>
        )}

{activeTab === 'board' && (
  <div className="row g-4">
    {['todo', 'inprogress', 'completed'].map(status => (
      <div className="col-lg-4" key={status}>
        <div className="p-3 rounded-4 bg-light shadow-sm min-vh-100">
          <h6 className="text-uppercase fw-bold text-muted mb-4 d-flex justify-content-between align-items-center">
            {status === 'inprogress' ? 'In Progress' : status}
            <span className="badge rounded-pill bg-white text-dark border">
              {tasks.filter(t => t.status === status).length}
            </span>
          </h6>

          {/* Task Cards */}
          <div className="task-list">
            {tasks.filter(t => t.status === status).map(task => (
              <div key={task._id} className="card border-0 shadow-sm mb-3 rounded-3 overflow-hidden"style={{ cursor: 'pointer' }}
                      onClick={() => handleOpenEditTaskModal(task)}>
                <div className="card-body p-3">
                  <h6 className="fw-bold mb-2">{task.taskname}</h6>
                  <p className="small text-muted mb-3 text-truncate">{task.desc}</p>
                  
                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="d-flex align-items-center">
                      <div className="bg-primary-subtle text-primary rounded-circle d-flex align-items-center justify-content-center me-2 fw-bold" style={{ width: '28px', height: '28px', fontSize: '0.7rem' }}>
                        {task.assignedTo?.name?.charAt(0) || '?'}
                      </div>
                      <span className="small fw-medium text-dark">{task.assignedTo?.name || 'Unassigned'}</span>
                    </div>
                    {task.dueDate && (
                      <span className="badge bg-light text-dark border-0 small font-monospace">
                        {new Date(task.dueDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* THE ADD TASK BUTTON: Styled like your "Add Employee" buttons */}
          {status === 'todo' && (
            <button 
              className="btn btn-white text-dark d-flex flex-column align-items-center justify-content-center p-3 rounded-3 border fw-bold shadow-sm mx-auto mt-8"
              style={{ width: '350px', height: '100px', borderStyle: 'solid' }}
              onClick={() => handleOpenTaskModal('todo')}
            >
              <span className="fs-3">+</span>
              <span className="small">Add task</span>
            </button>
          )}
        </div>
      </div>
    ))}
  </div>
)}

{activeTab === 'gantt' && (
  <div className="py-2">
    <div className="d-flex justify-content-between align-items-center mb-4">
       <h5 className="fw-bold mb-0">Timeline View</h5>
       <span className="text-muted small">Daily progress distribution</span>
    </div>
    
    {/* Render the Gantt Component */}
    <GanttChart sprint={sprint} tasks={tasks} />
  </div>
)}


<EditTaskModal 
        show={showEditTaskModal} 
        onClose={() => setShowEditTaskModal(false)} 
        task={taskToEdit} 
        sprintEmployees={sprint.employees} 
        onTaskUpdated={onTaskUpdated} 
        onTaskDeleted={onTaskDeleted} 
      />


<EditSprintModal 
        show={showEditModal} 
        onClose={() => setShowEditModal(false)} 
        sprint={sprint} 
        onSprintUpdated={onSprintUpdated} 
      />

      </div>

      <AddTaskModal 
        show={showTaskModal} 
        onClose={() => setShowTaskModal(false)}
        sprintId={id}
        sprintEmployees={sprint.employees}
        initialStatus={selectedStatus}
        onTaskAdded={(newTask) => {
          setTasks([...tasks, newTask]); 
        }}
      />
    </div>
  );
};

export default SprintDetails;

