import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sprint from './components/Sprint';
import Employee from './components/Employee';
import Setting from './components/Setting';
import Report from './components/Report';
import SprintDetails from './components/SprintDetails';
import EmployeeDetail from './components/EmployeeDetails'; 
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Navbar /> 
      <Routes>
        <Route path="/" element={<Sprint />} />
        <Route path="/sprints" element={<Sprint />} />
        <Route path="/sprint/:id" element={<SprintDetails />} />
        <Route path="/employee" element={<Employee />} />
        <Route path="/employee/:id" element={<EmployeeDetail />} />
        <Route path="/setting" element={<Setting/>}/>
        <Route path="/report" element={<Report/>}/>
      </Routes>
    </Router>
  );
  
}

export default App;
