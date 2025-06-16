// import React, { useState } from "react";
// import "../styles/DoctorLogin.css";

// const DoctorLogin = ({ onClose }) => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     try {
//       const response = await fetch("http://localhost:5555/api/doctors/login", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         alert("Login successful");
//         // Store token or user data if needed
//       } else {
//         alert(data.message || "Login failed");
//       }
//     } catch (error) {
//       console.error("Login error:", error);
//       alert("Something went wrong");
//     }
//   };

//   return (
//     <div className="modal-overlay">
//       <div className="modal">
//         <button className="close-button" onClick={onClose}>×</button>
//         <h2 className="modal-title">Doctor Login</h2>

//         <form className="login-form" onSubmit={handleLogin}>
//           <label>Email</label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <label>Password</label>
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />
//           <button type="submit" className="login-btn">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default DoctorLogin;

import React, { useState } from "react";
import "../styles/DoctorLogin.css";

const DoctorLogin = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://localhost:5000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      }
    );


      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }




      // ✅ Login successful — store token, redirect, etc.
      alert("Login successful!");
      onClose(); // Close the modal
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-button" onClick={onClose}>×</button>
        <h2 className="modal-title">Doctor Login</h2>

        <form className="login-form" onSubmit={handleLogin}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="login-btn" type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default DoctorLogin;
