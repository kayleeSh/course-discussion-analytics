import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Paper, Typography, List, ListItem, ListItemText, Pagination } from '@mui/material';

function InactiveStudentsList() {
  const [students, setStudents] = useState([]);
  const [inactiveCount, setInactiveCount] = useState(0);
  const [page, setPage] = useState(1);
  const studentsPerPage = 5;

  useEffect(() => {
    axios.get('http://localhost:3001/api/inactive-students')
      .then(res => {
        setStudents(res.data);
        setInactiveCount(res.data.length);
      })
      .catch(err => console.error('failed to get inactive student data:', err));
  }, []);

  const startIndex = (page - 1) * studentsPerPage;
  const currentStudents = students.slice(startIndex, startIndex + studentsPerPage);

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" mb={1}>
          😴 Inactive Students List
        </Typography>
        <Typography variant="subtitle2" color="textSecondary" mb={1}>
          Total number:{inactiveCount} students
        </Typography>
        <List sx={{ padding: 0 }}>
          {currentStudents.map((s) => (
            <ListItem key={`${s.user_id}-${s.course_id}`} sx={{ padding: '4px 8px' }}>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: s.is_deleted ? 'gray' : 'inherit',
                    }}
                  >
                    {s.user_name} {s.is_deleted && '⚠️'}
                  </Typography>
                }
                secondary={`Course ID: ${s.course_id}`}
                secondaryTypographyProps={{
                  variant: 'body2',
                  sx: { color: 'text.secondary', fontSize: '0.875rem' },
                }}
              />
            </ListItem>
          ))}
        </List>
        {students.length === 0 && <Typography variant="body2">There is no inactive students 👏</Typography>}

        <Pagination
          count={Math.ceil(inactiveCount / studentsPerPage)}
          page={page}
          onChange={handlePageChange}
          color="primary"
          sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
        />
      </Paper>
    </Box>
  );
}

export default InactiveStudentsList;
