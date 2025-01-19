import React from 'react';

const AppointmentCard = ({ title, value, growth }) => {
  const cardStyle = {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '250px',
  };

  const titleStyle = {
    fontSize: '18px',
    color: '#6b7280', // Gray color for title
  };

  const valueStyle = {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#111827', // Darker text for value
  };

  const growthStyle = {
    fontSize: '16px',
    marginTop: '10px',
    color: parseFloat(growth) > 0 ? '#22c55e' : '#ef4444', // Green for positive growth, red for negative
  };

  return (
    <div style={cardStyle}>
      <div style={titleStyle}>{title}</div>
      <div style={valueStyle}>{value}</div>
      <div style={growthStyle}>{growth}</div>
    </div>
  );
};

export default AppointmentCard;
