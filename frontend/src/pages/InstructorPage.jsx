import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import CoursesTable from '../components/CoursesTable';
import EnrollmentTable from '../components/EnrollmentTable';
import EntriesTable from '../components/EntriesTable';
import TopicsTable from '../components/TopicsTable';
import UsersTable from '../components/UsersTable';
import InstructorDashboard from '../components/InstructorDashboard';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TopicIcon from '@mui/icons-material/Topic';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DashboardIcon from '@mui/icons-material/Dashboard'; 

function InstructorPage() {
  const [selectedTab, setSelectedTab] = useState(0);
  const navigate = useNavigate(); // 初始化 navigate

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    navigate('/login'); // 跳转到登录页面
  };

  return (
    <>
      <AppBar position="fixed" sx={{ backgroundColor: '#1B263B', color: '#fff', boxShadow: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            Welcome Instructor 👩‍🏫 !
          </Typography>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <Tab label="Dashboard" icon={<DashboardIcon />} />
            <Tab label="Courses" icon={<BookIcon />} />
            <Tab label="Enrollments" icon={<PeopleIcon />} />
            <Tab label="Entries" icon={<ListAltIcon />} />
            <Tab label="Topics" icon={<TopicIcon />} />
            <Tab label="Users" icon={<AccountCircleIcon />} />
          </Tabs>
           
          <Button
            variant="contained"
            sx={{
            borderColor: '#fff', 
            color: '#fff', 
            '&:hover': {
                backgroundColor: '#003366', 
            },
            marginLeft: 2,
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, paddingTop: '80px', width: '100%' }}>
        {selectedTab === 0 && <InstructorDashboard />}
        {selectedTab === 1 && <CoursesTable />}
        {selectedTab === 2 && <EnrollmentTable />}
        {selectedTab === 3 && <EntriesTable />}
        {selectedTab === 4 && <TopicsTable />}
        {selectedTab === 5 && <UsersTable />}
      </Box>
    </>
  );
}

export default InstructorPage;
