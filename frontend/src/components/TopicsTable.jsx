import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Typography, Pagination, Box, FormControl, InputLabel, Select, MenuItem,
  Button, Stack, IconButton, Tooltip
} from '@mui/material';
import { saveAs } from 'file-saver';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ListAltIcon from '@mui/icons-material/ListAlt';
import { motion } from 'framer-motion';
import InboxIcon from '@mui/icons-material/Inbox';
import InfoIcon from '@mui/icons-material/Info';



function TopicsTable() {
  const [topics, setTopics] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [courses, setCourses] = useState([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const [stateFilter, setStateFilter] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');  // asc as default
  const [topicFilter, setTopicFilter] = useState('');


  // get courses data
  useEffect(() => {
    axios.get('http://localhost:3001/api/courses') 
      .then(res => {
        setCourses(res.data);
      })
      .catch(err => console.error('Failed to get courses data::', err));

    axios.get('http://localhost:3001/api/topics')
      .then(res => {
        setTopics(res.data);
        setFiltered(res.data);
      })
      .catch(err => console.error('Failed to get ropics data::', err));
  }, []);

  // Generate a mapping between course IDs and course names.
  const courseIdToName = courses.reduce((acc, course) => {
    acc[course.course_id] = course.course_name;
    return acc;
  }, {});

  // filter and sort
  useEffect(() => {
    let result = topics;

    if (stateFilter) {
      result = result.filter(t => t.topic_state === stateFilter);
    }

    if (courseFilter) {
      result = result.filter(t => courseIdToName[t.course_id] === courseFilter);
    }

    if (topicFilter) {
        result = result.filter(t =>
          t.topic_title?.toLowerCase().includes(topicFilter.toLowerCase())
        );
      }
      

    if (sortDirection) {
      result = result.sort((a, b) => {
        if (sortDirection === 'asc') {
          return new Date(a.topic_created_at) - new Date(b.topic_created_at);
        } else {
          return new Date(b.topic_created_at) - new Date(a.topic_created_at);
        }
      });
    }

    setFiltered(result);
    setPage(1); // reset pagination after filter
  }, [stateFilter, courseFilter,topicFilter, topics, courses, sortDirection]);

  const handleExportCSV = () => {
    const headers = ['topic_id,topic_course_id,topic_title,topic_state'];
    const rows = filtered.map(t => `${t.topic_id},${t.topic_course_id},"${t.topic_title}",${t.topic_state}`);
    const csvContent = headers.concat(rows).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'topics.csv');
  };

  const handlePageChange = (event, value) => setPage(value);
  const currentRows = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  const toggleSortDirection = () => {
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handleResetFilters = () => {
    setCourseFilter('');
    setStateFilter('');
    setTopicFilter('');
  };
  

  return (
    <Paper sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>📌 All Topics</Typography>

      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 2 }}>
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Topic Status</InputLabel>
          <Select value={stateFilter} onChange={e => setStateFilter(e.target.value)} label="Topic Status">
            <MenuItem value="">All</MenuItem>
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="deleted">Deleted</MenuItem>
          </Select>
        </FormControl>


        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel>Course Name</InputLabel>
          <Select value={courseFilter} onChange={e => setCourseFilter(e.target.value)} label="Course Name">
            <MenuItem value="">All</MenuItem>
            {courses.map(course => (
              <MenuItem key={course.course_id} value={course.course_name}>{course.course_name}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <FormControl size="small" sx={{ minWidth: 160 }}>
                <InputLabel>Topic Title</InputLabel>
                <Select
                value={topicFilter}
                onChange={e => setTopicFilter(e.target.value)}
                label="Topic Title"
                disabled={!courseFilter} // not apply if no course selected
                >
                <MenuItem value="">All</MenuItem>
                {topics
                    .filter(t => courseFilter === '' || courseIdToName[t.course_id] === courseFilter)
                    .map(t => (
                    <MenuItem key={t.topic_id} value={t.topic_title}>
                        {t.topic_title}
                    </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {!courseFilter && (
                <Tooltip title="Please select a course first" arrow>
                <InfoIcon color="disabled" fontSize="small" />
                </Tooltip>
            )}
        </Box>


        <Button variant="outlined" onClick={handleExportCSV}>
          Export CSV
        </Button>

        <Button variant="outlined" color="error" onClick={handleResetFilters}>
            Reset Filters
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', mb: 1, ml: 1 }}>
        <ListAltIcon fontSize="small" sx={{ mr: 0.5 }} />
        Total Number of Topics: {filtered.length} 
        </Typography>


      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Topic ID</TableCell>
              <TableCell>Topic Title</TableCell>
              <TableCell>Topic Content</TableCell>
              <TableCell>Created at
                <Tooltip title={`Sort by Created at (${sortDirection === 'asc' ? 'ascending' : 'descending'})`}>
                  <IconButton onClick={toggleSortDirection}>
                    {sortDirection === 'asc' ? <ArrowDropDownIcon /> : <ArrowDropUpIcon />}
                  </IconButton>
                </Tooltip>
              </TableCell>
              <TableCell>Deleted at</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>State</TableCell>
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
                        No topics found with the current filters.
                    </Typography>
                    </motion.div>
                </TableCell>
                </TableRow>
            ) : (
                currentRows.map(t => (
                <TableRow key={t.topic_id}>
                    <TableCell>{t.topic_id}</TableCell>
                    <TableCell>{t.topic_title}</TableCell>
                    <TableCell>{t.topic_content}</TableCell>
                    <TableCell>{t.topic_created_at}</TableCell>
                    <TableCell>{t.topic_deleted_at}</TableCell>
                    <TableCell>{courseIdToName[t.course_id]}</TableCell>
                    <TableCell>{t.topic_state}</TableCell>
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
          onChange={handlePageChange}
        />
      </Box>
    </Paper>
  );
}

export default TopicsTable;
