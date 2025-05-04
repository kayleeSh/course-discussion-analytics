import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function CourseEnrollmentChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/course-enrollment-count')
      .then(res => setData(res.data))
      .catch(err => console.error('ailed to get course enrollment data:', err));
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>📚 Enrollment Numbers for Each Course</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="course_name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="student_count" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
}

export default CourseEnrollmentChart;
