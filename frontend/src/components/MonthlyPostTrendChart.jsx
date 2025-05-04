import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

function MonthlyPostTrendChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3001/api/monthly-post-count')
      .then(res => setData(res.data))
      .catch(err => console.error('failed to get monthly post count:', err));
  }, []);

  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          📅 Monthly Post Volume Trend
        </Typography>
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#00CD7C" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <Typography>加载中...</Typography>
        )}
      </Paper>
    </Box>
  );
}

export default MonthlyPostTrendChart;
