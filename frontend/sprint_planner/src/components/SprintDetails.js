import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import AddTaskModal from '../modals/AddTaskModal';

const SprintDetails = () => {
  const { id } = useParams();
  const [sprint, setSprint] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [allEmployees, setAllEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);
  // State to control the Task Modal visibility
  const [showTaskModal, setShowTaskModal] = useState(false);
// State to remember which column we are adding to
const [selectedStatus, setSelectedStatus] = useState('todo');


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

//  const delSprint = async (empId) => {
//     try {
//       // We send a PUT request to the backend with the Employee's ID
//       const response = await axios.put(`http://localhost:8000/sprint/${id}`, {
//         employeeId: null
//       });
      
//       // We update the local state with the new data from the server
//       // This makes the person jump from the "Add" list to the "Assigned" list instantly
//       setSprint(response.data);
//     } catch (err) {
//       console.error("Error adding employee:", err);
//       alert("Could not add employee. Make sure the backend route exists.");
//     }
//   };



const handleOpenTaskModal = (status) => {
  setSelectedStatus(status); // Set status to 'todo', 'inprogress', or 'completed'
  setShowTaskModal(true);    // Open the modal
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
          <button className="btn btn-outline-secondary btn-sm px-3">Edit sprint</button>
          <button className="btn btn-outline-secondary btn-sm px-3 mx-2">Mark complete</button>
          <button className="btn btn-outline-danger btn-sm px-3">Delete</button>
        </div>
      </div>
      
{/* 1. THE GLOBAL + ADD TASK BUTTON (Sit here!) */}
      {/* <button 
        className="btn btn-white text-dark d-flex flex-column align-items-center justify-content-center p-3 rounded-3 border fw-bold shadow-sm"
        style={{ width: '80px', height: '80px', borderStyle: 'solid' }}
        onClick={() => handleOpenTaskModal('todo')} // You can default it to 'todo'
      >
        <span className="fs-3">+</span>
        <span className="small">Add task</span>
      </button> */}

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
          <div className="row g-4">
            <div className="col-md-8">
              <div className="card border-0 shadow-sm p-4 mb-4">
                <h6 className="text-uppercase text-muted fw-bold small mb-3">Sprint Goal</h6>
                <p className="lead">{sprint.goal || "No goal defined for this sprint."}</p>
              </div>
            </div>
            <div className="col-md-4">
                <div className="card border-0 shadow-sm p-4">
                    <div className="mb-3">
                        <small className="text-muted">Start Date</small>
                        <p className="fw-bold">{new Date(sprint.startDate).toLocaleDateString()}</p>
                    </div>
                    <div className="mb-0">
                        <small className="text-muted">End Date</small>
                        <p className="fw-bold">{new Date(sprint.endDate).toLocaleDateString()}</p>
                    </div>
                </div>
            </div>
          </div>
        )}

        {activeTab === 'team' && (
  <div className="card border-0 shadow-sm p-4">
    {/* SECTION 1: Current Assigned Members */}
    <div className="mb-5">
      <h5 className="fw-bold mb-4 text-dark">Assigned members</h5>
      <div className="list-group list-group-flush">
        {sprint.employees && sprint.employees.length > 0 ? (
          sprint.employees.map(emp => (
            <div key={emp._id} className="list-group-item d-flex justify-content-between align-items-center py-3 border-light px-0">
              <div className="d-flex align-items-center">
                <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3 fw-bold" style={{width: '40px', height: '40px'}}>
                  {emp.name.charAt(0)}
                </div>
                <div>
                  <div className="fw-bold">{emp.name}</div>
                  <div className="small text-muted">{emp.role}</div>
                </div>
              </div>
              <button className="btn btn-link text-danger text-decoration-none btn-sm">Remove</button>
            </div>
          ))
        ) : (
          <p className="text-muted italic">No one assigned yet.</p>
        )}
      </div>
    </div>

    <hr className="my-4 text-secondary opacity-25" />

    {/* SECTION 2: Add New Members (Now Below) */}
    <div>
      <h5 className="fw-bold mb-3 text-dark">Add to team</h5>
      <p className="small text-muted mb-3">Select an employee from the company directory to add to this sprint.</p>
      
      <div className="list-group border rounded-3 overflow-hidden" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        {/* Optional: Filter out people already in the sprint */}
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
              <div key={task._id} className="card border-0 shadow-sm mb-3 rounded-3 overflow-hidden">
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
          {/* <button 
  className="btn btn-white w-100 py-3 border-dashed border-2 rounded-3 text-muted fw-bold d-flex align-items-center justify-content-center bg-white shadow-sm mt-2"
  style={{ borderStyle: 'dashed' }}
  onClick={() => handleOpenTaskModal(status)} // This calls the function above
>
  <span className="me-2 fs-4">+</span> Add Task
</button> */}
        </div>
      </div>
    ))}
  </div>
)}

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

