import React, { useEffect, useState } from 'react';
import PatientCard from '../components/PatientCard';
import '../styles/PatientList.css';
import Topbar from '../components/TopBar';

const PatientList = () => {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // state to store sort order

  useEffect(() => {
    fetch('https://my-json-server.typicode.com/EmamaBilalKhan/MediConnect-API-2/Patients')
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
      })
      .catch((error) => {
        console.error('Error fetching patient data:', error);
      });
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value); // set the sort order based on the selected option
  };

  const sortedPatients = [...patients].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.name.localeCompare(b.name); // sort in ascending order
    } else if (sortOrder === 'desc') {
      return b.name.localeCompare(a.name); // sort in descending order
    }
    return 0;
  });

  const filteredPatients = sortedPatients.filter((patient) => {
    return patient.name.toLowerCase().includes(searchTerm);
  });

  return (
    <>
      <Topbar pageTitle="Patient List" />
      <div className="patient-list">
        <div className="patient-searchbar">
          <input 
            type="text" 
            placeholder="Search for patient here..." 
            value={searchTerm} 
            onChange={handleSearch} 
            className="search-input"
          />
          <select value={sortOrder} onChange={handleSortChange} className="sort-dropdown">
            <option value="asc">Sort by Name (A-Z)</option>
            <option value="desc">Sort by Name (Z-A)</option>
          </select>
        </div>

        <div className="patient-grid">
          {filteredPatients.map((patient) => (
            <PatientCard key={patient.patientid} patient={patient} />
          ))}
        </div>
      </div>
    </>
  );
};

export default PatientList;
