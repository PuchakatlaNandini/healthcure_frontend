import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PatientLogin.css';

const PatientLogin = ({ onClose }) => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      localStorage.setItem('currentUser', JSON.stringify(data.user));
      localStorage.setItem('token', data.token); // optional

      if (onClose) onClose();
      navigate('/patient/dashboard');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close-button" onClick={() => {
          if (typeof onClose === 'function') {
            onClose();
          } else {
            navigate('/');
          }
        }} style={{cursor: 'pointer', position: 'absolute', top: 10, right: 20, fontSize: 28}}>&times;</span>
        <h2 className="modal-title">Patient Login</h2>
        <form onSubmit={handleLogin} className="login-form">
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
          <button type="submit" className="login-btn">Login</button>
        </form>
        <button className="login-btn" style={{marginTop: '10px', background: '#fff', color: '#2355d6', border: '1px solid #2355d6'}} onClick={() => navigate('/patient/register')}>
          New user? Register here
        </button>
      </div>
    </div>
  );
};

export default PatientLogin;
