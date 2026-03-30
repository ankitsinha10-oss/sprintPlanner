import React from 'react';
import { useNavigate } from 'react-router-dom';


const SprintItem = (props) => {
    
    const { sprint } = props;
     const navigate = useNavigate(); 

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
                    <button className="btn btn-primary btn-sm">Edit Sprint</button>
                </div>
            </div>
        </div>
    );
};
export default SprintItem;
