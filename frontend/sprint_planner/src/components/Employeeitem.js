import React from 'react';

const EmployeeItem = ({ employee }) => {
    return (
        <div className="col-md-4 mb-4">
            <div className="card border-0 shadow-sm h-100 p-3">
                <div className="card-body">
                    <div className="d-flex align-items-center mb-3">
                        <div className="rounded-circle bg-info-subtle text-info d-flex align-items-center justify-content-center fw-bold me-3" 
                             style={{ width: '45px', height: '45px', fontSize: '1.2rem' }}>
                            {employee.name.charAt(0)}
                        </div>
                        <div>
                            <h5 className="card-title mb-0 fw-bold text-dark">{employee.name}</h5>
                            <span className="badge bg-light text-secondary border rounded-pill">{employee.role}</span>
                        </div>
                    </div>
                    
                    <div className="mb-3 pt-2 border-top">
                        <small className="text-muted d-block">Email Address</small>
                        <span className="text-dark fw-medium">{employee.email}</span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                        <small className="text-muted">ID: #{employee.employeeId}</small>
                        <button className="btn btn-outline-dark btn-sm rounded-pill px-3">View Profile</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EmployeeItem;