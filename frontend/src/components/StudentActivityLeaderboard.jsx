import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, List, ListItem, ListItemText, Pagination } from '@mui/material';

function StudentActivityLeaderboard() {
  const [activityData, setActivityData] = useState([]);
  const [page, setPage] = useState(1);  
  const studentsPerPage = 5;  

  useEffect(() => {
    axios.get('http://localhost:3001/api/student-activity')
      .then(res => setActivityData(res.data))
      .catch(err => console.error("Error fetching student activity data:", err));
  }, []);

  //calculate current page student
  const startIndex = (page - 1) * studentsPerPage;
  const currentStudents = activityData.slice(startIndex, startIndex + studentsPerPage);

  //handle page number changed
  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Typography variant="h6" mb={2}>
          🏆 Active Students List
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" mb={1}>
          Total number: {activityData.length} students
        </Typography>
        <List>
          {currentStudents.map((item, index) => (
            <ListItem key={item.user_id}>
              <ListItemText 
                primary={
                <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: item.is_deleted ? 'gray' : 'inherit',
                }}
                >
                  {item.user_name}
                </Typography>
              }
                                  
                                
                secondary={`Number of Post: ${item.post_count}`}
              />
            </ListItem>
          ))}
        </List>

        <Pagination
          count={Math.ceil(activityData.length / studentsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          siblingCount={0}     // shows one only beside current page
          boundaryCount={1}    // shows one at left or right
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />

      </Paper>
    </Box>
  );
}

export default StudentActivityLeaderboard;
