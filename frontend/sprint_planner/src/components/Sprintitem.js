import React from 'react';
import { useNavigate } from 'react-router-dom';


const SprintItem = (props) => {
    
    const { sprint } = props;
    const { sprintTasks = [] } = props;
    
     const navigate = useNavigate(); 

     // 2. Calculate the progress
    const total = sprintTasks.length;
    const completed = sprintTasks.filter(t => t.status === 'completed').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    const handleViewDetails = () => {
        navigate(`/sprint/${sprint._id}`);}

    return (
        <div className="col-md-4 mb-3"> {/* Added column for layout */}
            <div className="card shadow-sm h-100" onClick={handleViewDetails} style={{ cursor: 'pointer' }}>
                <div className="card-body">
                    <h5 className="card-title">{sprint.sprintname}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">Sprint #{sprint.sprintId}</h6>
                    <p className="card-text">
                        <strong>Name:</strong> {sprint.sprintname} <br/> 
                        <strong>Goal:</strong> {sprint.goal} <br/> 
                        <strong>Status:</strong> <span className="badge bg-success">{sprint.status}</span>
                    </p>

{/* --- ADDED PROGRESS BAR START --- */}
                    <div className="progress mb-2" style={{ height: '10px' }}>
                        <div 
                            className="progress-bar bg-primary" 
                            role="progressbar" 
                            style={{ width: `${percent}%`, transition: 'width 0.5s' }}
                        ></div>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                        <small className="text-muted fw-bold">{percent}% done</small>
                        <small className="text-muted">{completed}/{total} tasks</small>
                    </div>
                    {/* --- ADDED PROGRESS BAR END --- */}


                    <button className="btn btn-primary btn-sm">Edit Sprint</button>
                </div>
            </div>
        </div>
    );
};
export default SprintItem;
