import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import AdminPage from './pages/AdminPage';
import InstructorPage from './pages/InstructorPage';
// import InstructorDashboard from './InstructorDashboard';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        {/* <DiscussionList /> */}

        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/instructor" element={<InstructorPage />} />
            {/* <Route path="/instructordashboard" element={<InstructorDashboard />} /> */}
          </Routes>
        </Router>
      </div>
      
     
      
    </>
  )
}

export default App
