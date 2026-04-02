import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import EmployeeItem from './Employeeitem'; 
import AddEmployeeModal from '../modals/AddEmployeeModal';

const Employee = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

 
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
 useEffect(() => {
    fetchEmployee();
  }, []);

// 3. This function is called by the Modal after a successful POST request
  const handleEmployeeAdded = () => {
    fetchEmployee();    // Refresh the list to show the new sprint
    setShowModal(false); // Close the modal
  };


  if (loading) return <div className="container mt-5">Loading employees...</div>;

  return (

<div className="container mt-5">
      <h2 className="mb-4">Employees List</h2>
      
      <button 
          type="button" 
          className="btn btn-outline-dark px-4 py-2 rounded-pill fw-semibold"
          onClick={() => setShowModal(true)}
        >
          + New employee
        </button>


      <div className="row">
        {employees.map((employee) => (
          <EmployeeItem key={employee._id} employee={employee} />
        ))}
      </div>

      
      <AddEmployeeModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onEmployeeAdded={handleEmployeeAdded} 
      />


    </div>
  );
};

export default Employee;





























