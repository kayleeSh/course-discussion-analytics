import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function CourseTopicCountChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/course-topic-count')
      .then(res => setData(res.data))
      .catch(err => console.error('failed to get topics number of course:', err));
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          📘 Number of Topics per Course
        </Typography>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="course_name" />
              <Tooltip />
              <Bar dataKey="topic_count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <Typography>加载中...</Typography>
        )}
      </Paper>
    </Box>
  );
}

export default CourseTopicCountChart;
