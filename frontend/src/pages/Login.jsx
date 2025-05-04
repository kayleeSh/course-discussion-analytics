import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // 发送用户名和角色信息进行登录验证
      const res = await axios.post('http://localhost:3001/api/login', { username: role });

      const { role: userRole, user_id } = res.data;
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('role', userRole);

      if (userRole === 'admin') {
        navigate('/admin');
      } else if (userRole === 'instructor') {
        navigate('/instructor');
      }
    } catch (err) {
      setError('Login failed: wrong user role ❌');
    }
  };

  return (
    <div style={{
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh', // Full height of the viewport
      backgroundColor: '#fff', // White background
    }}>
      <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem', color: '#333' }}>
        Course Discussion Analytics 📊
      </h2>

      {/* Role selector */}
      <select
        value={role}
        onChange={(e) => setRole(e.target.value)}
        style={{
          padding: '1rem',
          marginBottom: '1.5rem',
          fontSize: '1rem',
          width: '100%',
          maxWidth: '400px', // Max width for select
          borderRadius: '8px',
          border: '1px solid #ddd', // Light gray border
          backgroundColor: '#f9f9f9', // Light background color for select
          color: '#333', // Text color inside select
        }}
      >
        <option value="">Please select your role: 🎭</option>
        <option value="instructor_1">Instructor 1   👩‍🏫 🧑‍🏫</option>
        <option value="admin_1">Admin 1  👩‍💼 🧑‍💼</option>
      </select>

      {/* Login button */}
      <button
        onClick={handleLogin}
        style={{
          padding: '1rem 2rem',
          fontSize: '1.2rem',
          backgroundColor: '#1B263B', // Dark blue color for button
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          width: '100%',
          maxWidth: '400px', // Max width for button
          transition: 'background-color 0.3s ease',
        }}
      >
        Login 🚀
      </button>

      {/* Error message */}
      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error} 😞</p>}
    </div>
  );
}

export default Login;
