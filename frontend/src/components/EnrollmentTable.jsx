import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Pagination, Box, FormControl, InputLabel, Select, MenuItem,
  Button, Stack
} from '@mui/material';
import { saveAs } from 'file-saver';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { motion } from 'framer-motion';
import InboxIcon from '@mui/icons-material/Inbox';



function EnrollmentTable() {
  const [enrollments, setEnrollments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [typeFilter, setTypeFilter] = useState('');
  const [stateFilter, setStateFilter] = useState('');

  useEffect(() => {
    axios.get('http://localhost:3001/api/enrollment')
      .then(res => {
        setEnrollments(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error('Failed to get courses data:', err));
  }, []);

  useEffect(() => {
    let result = enrollments;
    if (typeFilter) {
      result = result.filter(e => e.enrollment_type === typeFilter);
    }
    if (stateFilter) {
      result = result.filter(e => e.enrollment_state === stateFilter);
    }
    setFiltered(result);
    setPage(1); //reset pagination after filter
  }, [typeFilter, stateFilter, enrollments]);

  const handleExportCSV = () => {
    const headers = ['user_id,course_id,enrollment_type,enrollment_state'];
    const rows = filtered.map(e => `${e.user_id},${e.course_id},${e.enrollment_type},${e.enrollment_state}`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'enrollments.csv');
  };

  const currentRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const handleResetFilters = () => {
    setTypeFilter('');
    setStateFilter('');
  };

  return (
    <Paper sx={{ p: 2, width: '100%' }}>
      <Typography variant="h6" gutterBottom>🧑‍🏫 All Enrollments</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Enrollment Type</InputLabel>
          <Select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} label="Enrollment Type">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="student">Student</MenuItem>
            <MenuItem value="teacher">Teacher</MenuItem>
          </Select>
        </FormControl>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Status</InputLabel>
          <Select value={stateFilter} onChange={e => setStateFilter(e.target.value)} label="Enrollment Status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="deleted">Deleted</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>
        <Button variant="outlined" color="error" onClick={handleResetFilters}>
            Reset Filters
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <ListAltIcon fontSize="small" sx={{ mr: 0.5 }} />
         Total Number of Enrollments: {filtered.length}
        </Typography>

      <TableContainer sx={{ width: '100%' }}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Course ID</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {currentRows.length === 0 ? (
            <TableRow>
                <TableCell colSpan={4} align="center" sx={{ py: 6 }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <InboxIcon sx={{ fontSize: 50, color: 'gray' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    No enrollments found with the current filters.
                    </Typography>
                </motion.div>
                </TableCell>
            </TableRow>
            ) : (
                currentRows.map((e, i) => (
                <TableRow key={`${e.user_id}-${e.course_id}-${i}`}>
                    <TableCell>{e.user_id}</TableCell>
                    <TableCell>{e.course_id}</TableCell>
                    <TableCell>{e.enrollment_type}</TableCell>
                    <TableCell>{e.enrollment_state}</TableCell>
                </TableRow>
                ))
            )}
            </TableBody>

        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination
          count={Math.ceil(filtered.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>
    </Paper>
  );
}

export default EnrollmentTable;
