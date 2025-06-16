// import React, { useState } from 'react';
// import '../styles/DoctorLogin.css'; // Reusing the same CSS

// const PatientLogin = ({ onClose }) => {
//   const [formData, setFormData] = useState({
//     email: '',
//     password: ''
//   });

//   const [error, setError] = useState('');

//   const handleChange = (e) => {
//     setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     try {
//       const response = await fetch('http://localhost:5555/api/users/login', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();
//       if (!response.ok) {
//         throw new Error(data.message || 'Login failed');
//       }

//       alert('Login successful!');
//       onClose(); // Close the modal on success
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <span className="close-button" onClick={onClose}>&times;</span>
//         <h2 className="modal-title">Patient Login</h2>
//         <form onSubmit={handleSubmit} className="login-form">
//             <label>Email</label>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email"
//             value={formData.email}
//             onChange={handleChange}
//             required
//           />
//           <label>Password</label>
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             value={formData.password}
//             onChange={handleChange}
//             required
//           />
//           {error && <p className="error-message">{error}</p>}
//           <button className="login-btn" type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default PatientLogin;


import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
//import '../styles/DoctorLogin.css'; // Reusing the same CSS
import '../styles/PatientLogin.css';

const PatientLogin = ({ onClose }) => {
  const navigate = useNavigate(); // Initialize navigate
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');

  //   try {
  //     const response = await fetch('http://localhost:5555/api/users/login', {
  //       method: 'POST',
  //       headers: { 'Content-Type': 'application/json' },
  //       body: JSON.stringify(formData)
  //     });

  //     const data = await response.json();
  //     if (!response.ok) {
  //       throw new Error(data.message || 'Login failed');
  //     }

  //   //   alert('Login successful!');
  //     onClose(); 

  //     //  Navigate to patient dashboard
  //     navigate('/patient/dashboard');

  //   } catch (err) {
  //     setError(err.message);
  //   }
  // };
const handleSubmit = async (e) => {
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

    //  Save user info to localStorage
    localStorage.setItem("currentUser", JSON.stringify(data));

    //  Optional: close modal
    onClose(); 

    //  Navigate to dashboard
    navigate('/patient/dashboard');

  } catch (err) {
    setError(err.message);
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal">
        <span className="close-button" onClick={onClose}>&times;</span>
        <h2 className="modal-title">Patient Login</h2>
        <form onSubmit={handleSubmit} className="login-form">
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
          {error && <p className="error-message">{error}</p>}
          <button className="login-btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default PatientLogin;
