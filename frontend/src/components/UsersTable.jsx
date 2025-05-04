import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Pagination, Box
} from '@mui/material';

function UsersTable() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    axios.get('http://localhost:3001/api/user')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Failed to get user data:', err));
  }, []);

  const handlePageChange = (event, value) => setPage(value);
  const currentRows = users.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>👤 All Users</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>State</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.map(u => (
              <TableRow key={u.user_id || u.user_id_deleted}>
                <TableCell>{u.user_id || u.user_id_deleted}</TableCell>
                <TableCell>{u.user_name}</TableCell>
                <TableCell>{u.user_state}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Pagination count={Math.ceil(users.length / rowsPerPage)} page={page} onChange={handlePageChange} />
      </Box>
    </Paper>
  );
}

export default UsersTable;
