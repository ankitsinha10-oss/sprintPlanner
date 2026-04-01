import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const EmployeeDetail = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/employees/${id}`);
        setEmployee(res.data);
      } catch (err) {
        console.error("Error fetching employee:", err);
      }
    };
    fetchEmployee();
  }, [id]);

  if (!employee) return <div className="container mt-5">Loading profile...</div>;

  return (
    <div className="container mt-5">
      <Link to="/employee" className="btn btn-link text-decoration-none mb-3">← Back to Employees</Link>
      <div className="card shadow-sm p-4 border-0">
        <div className="d-flex align-items-center mb-4">
          <div className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center fw-bold me-3" style={{width: '70px', height: '70px', fontSize: '2rem'}}>
            {employee.name.charAt(0)}
          </div>
          <div>
            <h2 className="fw-bold mb-0">{employee.name}</h2>
            <span className="badge bg-info-subtle text-info rounded-pill">{employee.role}</span>
          </div>
        </div>
        <div className="row">
          <div className="col-md-6">
            <p><strong>Email:</strong> {employee.email}</p>
            <p><strong>Employee ID:</strong> #{employee.employeeId}</p>
            <p><strong>Joined:</strong> {new Date(employee.createdAt).toLocaleDateString()}</p>
            <p><strong>Email:</strong> {(employee.email)}</p>
            <p><strong>Role:</strong> {(employee.role)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetail;