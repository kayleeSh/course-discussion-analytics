import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Pagination, Box, FormControl, InputLabel, Select, MenuItem,
  Button, Stack, IconButton
} from '@mui/material';
import { saveAs } from 'file-saver';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { motion } from 'framer-motion';
import InboxIcon from '@mui/icons-material/Inbox';


function EntriesTable() {
  const [entries, setEntries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [users, setUsers] = useState([]);
  const [topics, setTopics] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [stateFilter, setStateFilter] = useState('');
  const [topicFilter, setTopicFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 排序方向

  useEffect(() => {

    //get entries data
    axios.get('http://localhost:3001/api/entries')
      .then(res => {
        setEntries(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error('Failed to get entries data:', err));

    //get user data
    axios.get('http://localhost:3001/api/user')
      .then(res => setUsers(res.data))
      .catch(err => console.error('Failed to get user data:', err));

    //get topics data
    axios.get('http://localhost:3001/api/topics')
    .then(res => setTopics(res.data))
    .catch(err => console.error('Failed to get topics data:', err));

  }, []);

  useEffect(() => {
    let result = entries;
    if (stateFilter) {
      result = result.filter(e => e.entry_state === stateFilter);
    }
    if (topicFilter) {
        const selectedTopic = topics.find(t => t.topic_title === topicFilter);
        if (selectedTopic) {
          result = result.filter(e => e.topic_id === selectedTopic.topic_id);
        }
    }
      
      

    //sort by entry_created_at
    result = result.sort((a, b) => {
      const dateA = new Date(a.entry_created_at);
      const dateB = new Date(b.entry_created_at);
      return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    setFiltered(result);
    setPage(1); //reset pagination after filter
  }, [stateFilter, topicFilter, entries, sortOrder]);

  const handleExportCSV = () => {
    const headers = ['entry_id,entry_content,entry_created_at,entry_deleted_at,entry_state,topic_id,entry_posted_by_user_id'];
    const rows = filtered.map(e => `${e.entry_id},"${e.entry_content}",${e.entry_created_at},${e.entry_deleted_at},${e.entry_state},${e.topic_id},${e.entry_posted_by_user_id}`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'entries.csv');
  };

  const handleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc'); //switch sort order
  };

  const currentRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const getUserName = (userId) => {
    const user = users.find(u => u.user_id === userId);
    return user ? user.user_name : `Unknown (${userId})`;
  };

  const getTopicTitle = (topicId) => {
    const topic = topics.find(t => t.topic_id === topicId);
    return topic ? topic.topic_title : `Unknown (${topicId})`;
  };
  
  const handleResetFilters = () => {
    setStateFilter('');
    setSortOrder('');
    setTopicFilter('');
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>📝 All Entries</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Entry Status</InputLabel>
          <Select value={stateFilter} onChange={e => setStateFilter(e.target.value)} label="帖子状态">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="deleted">Deleted</MenuItem>
          </Select>
        </FormControl>
         <FormControl size="small" sx={{ minWidth: 160 }}>
            <InputLabel>Topic Title</InputLabel>
            <Select value={topicFilter} onChange={e => setTopicFilter(e.target.value)} label="Topic Title">
            <MenuItem value="">All</MenuItem>
            {topics.map(topics => (
                <MenuItem key={topics.topic_id} value={topics.topic_title}>{topics.topic_title}</MenuItem>
            ))}
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
         Total Number of Entries: {filtered.length}
        </Typography>

      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Entry ID</TableCell>
              <TableCell>Entry Content</TableCell>
              <TableCell>Created at 
                <IconButton onClick={handleSort} size="small">
                  {sortOrder === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                </IconButton>
              </TableCell>
              <TableCell>Deleted at</TableCell>
              <TableCell>State</TableCell>
              <TableCell>Topic Title</TableCell>
              <TableCell>Posted By</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {currentRows.length === 0 ? (
                <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                    <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    >
                    <InboxIcon sx={{ fontSize: 50, color: 'gray' }} />
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        No entries found with the current filters.
                    </Typography>
                    </motion.div>
                </TableCell>
                </TableRow>
            ) : (
                currentRows.map(e => (
                <TableRow key={e.entry_id}>
                    <TableCell>{e.entry_id}</TableCell>
                    <TableCell>{e.entry_content}</TableCell>
                    <TableCell>{e.entry_created_at}</TableCell>
                    <TableCell>{e.entry_deleted_at}</TableCell>
                    <TableCell>{e.entry_state}</TableCell>
                    <TableCell>{getTopicTitle(e.topic_id)}</TableCell>
                    <TableCell>{getUserName(e.entry_posted_by_user_id)}</TableCell>
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

export default EntriesTable;
