// import React from 'react';
// import Navbar from './components/Navbar';



// function App() {
//   return (
//     <div>
//       <Navbar />
      
//       {/* other components here */}
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import PatientDashboard from './pages/PatientDashboard';
import BookAppointment from './pages/BookAppointment';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* Route for patient dashboard */}
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          
          {/* You can add more routes like home, login, doctor dashboard, etc */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
