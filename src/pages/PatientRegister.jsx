import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PatientRegister = ({ onClose }) => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      localStorage.setItem('currentUser', JSON.stringify(data));
      if (onClose) onClose();
      navigate('/patient/login');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close-button" onClick={() => navigate('/')} style={{cursor: 'pointer', position: 'absolute', top: 10, right: 20, fontSize: 28}}>&times;</span>
        <h2 className="modal-title">Patient Registration</h2>
        <form onSubmit={handleRegister} className="login-form">
          <label>Name</label>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          <button type="submit" style={{ width: '100%', padding: '10px', fontSize: '16px', marginTop: '10px' }}>Register</button>
        </form>
      </div>
    </div>
  );
};

export default PatientRegister;
