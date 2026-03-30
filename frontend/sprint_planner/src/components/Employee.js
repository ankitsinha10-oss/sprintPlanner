import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import EmployeeItem from './Employeeitem'; 

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get('http://localhost:8000/employees'); 
        setEmployees(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee:", error);
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  if (loading) return <div className="container mt-5">Loading employees...</div>;

  return (

<div className="container mt-5">
      <h2 className="mb-4">Employees List</h2>
      
      <div className="row">
        {employees.map((employee) => (
          <EmployeeItem key={employee._id} employee={employee} />
        ))}
      </div>
    </div>
  );
};

export default Employee;





























