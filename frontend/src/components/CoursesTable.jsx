import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, TextField, MenuItem, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Pagination } from '@mui/material';
import { CSVLink } from 'react-csv';
import { Typography } from '@mui/material';
import ListAltIcon from '@mui/icons-material/ListAlt';


function CoursesTable() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    axios.get('http://localhost:3001/api/courses')
      .then(res => {
        setCourses(res.data);
        setFiltered(res.data);
      });
  }, []);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const currentRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ px: 4, py: 2, maxWidth: '100%', overflowX: 'auto' }}>
    <Typography variant="h6" gutterBottom>📚 All Courses</Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Button variant="outlined">
          <CSVLink data={filtered} filename="courses.csv" style={{ textDecoration: 'none', color: 'inherit' }}>
            Export CSV
          </CSVLink>
        </Button>
      </Box>

      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <ListAltIcon fontSize="small" sx={{ mr: 0.5 }} />
         Total Number of Courses: {filtered.length}
        </Typography>

      <TableContainer component={Paper} sx={{ width: '100%' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Course ID</TableCell>
              <TableCell>Semester</TableCell>
              <TableCell>Course Code</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Created at</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map(row => (
              <TableRow key={row.course_id}>
                <TableCell>{row.course_id}</TableCell>
                <TableCell>{row.semester}</TableCell>
                <TableCell>{row.course_code}</TableCell>
                <TableCell>{row.course_name}</TableCell>
                <TableCell>{row.course_created_at}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Pagination
        count={Math.ceil(filtered.length / rowsPerPage)}
        page={page}
        onChange={handlePageChange}
        sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}
      />
    </Box>
  );
}

export default CoursesTable;
