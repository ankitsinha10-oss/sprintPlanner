import React, { useState, useEffect } from 'react';
import axios from 'axios'; 
import SprintItem from './Sprintitem'; 
import AddSprintModal from '../modals/AddSprintModal'; // Ensure this path is correct

const Sprint = () => {
  const [sprints, setSprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // 1. Function to fetch all sprints from Backend
  const fetchSprints = async () => {
    try {
      const response = await axios.get('http://localhost:8000/sprint'); 
      setSprints(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching sprints:", error);
      setLoading(false);
    }
  };

  // 2. Run fetch on component load
  useEffect(() => {
    fetchSprints();
  }, []);

  // 3. This function is called by the Modal after a successful POST request
  const handleSprintAdded = () => {
    fetchSprints();    // Refresh the list to show the new sprint
    setShowModal(false); // Close the modal
  };

  if (loading) return <div className="container mt-5">Loading sprints...</div>;

  return (
    <div className="container mt-5">
      {/* Header Section */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 fw-bold">All sprints</h2>
          <p className="text-muted mb-0">{sprints.length} sprints total</p>
        </div>
        
        <button 
          type="button" 
          className="btn btn-outline-dark px-4 py-2 rounded-pill fw-semibold"
          onClick={() => setShowModal(true)}
        >
          + New sprint
        </button>
      </div>
      
      {/* Sprint Grid */}
      <div className="row">
        {sprints.map((sprint) => (
          <SprintItem key={sprint._id} sprint={sprint} />
        ))}
      </div>

      {/* The Separate Modal Component */}
      <AddSprintModal 
        show={showModal} 
        onClose={() => setShowModal(false)} 
        onSprintAdded={handleSprintAdded} 
      />
    </div>
  );
};

export default Sprint;