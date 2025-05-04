import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Tabs, Tab, Box, Paper, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // 导入 useNavigate
import CoursesTable from '../components/CoursesTable';
import EnrollmentTable from '../components/EnrollmentTable';
import EntriesTable from '../components/EntriesTable';
import TopicsTable from '../components/TopicsTable';
import UsersTable from '../components/UsersTable';
import BookIcon from '@mui/icons-material/Book';
import PeopleIcon from '@mui/icons-material/People';
import ListAltIcon from '@mui/icons-material/ListAlt';
import TopicIcon from '@mui/icons-material/Topic';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

function AdminPage() {
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
      <AppBar position="fixed" sx={{ backgroundColor: '#00695c', color: '#fff', boxShadow: 3 }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center' }}>
            Welcome Admin 👩‍💼 !
          </Typography>
          <Tabs
            value={selectedTab}
            onChange={handleTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              '& .MuiTabs-flexContainer': {
                display: 'flex',
                justifyContent: 'space-around',
                width: '100%',
              },
            }}
          >
            <Tab label="Courses" icon={<BookIcon />} />
            <Tab label="Enrollments" icon={<PeopleIcon />} />
            <Tab label="Entries" icon={<ListAltIcon />} />
            <Tab label="Topics" icon={<TopicIcon />} />
            <Tab label="Users" icon={<AccountCircleIcon />} />
          </Tabs>
          <Button
            variant="outlined"
            sx={{
              marginLeft: 2,
              borderColor: '#fff', 
              color: '#fff', 
              '&:hover': {
                borderColor: '#004d40', 
                backgroundColor: '#004d40', 
                color: '#fff', 
              },
            }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: 2, paddingTop: '80px', width: '100%' }}>
        {selectedTab === 0 && <CoursesTable />}
        {selectedTab === 1 && <EnrollmentTable />}
        {selectedTab === 2 && <EntriesTable />}
        {selectedTab === 3 && <TopicsTable />}
        {selectedTab === 4 && <UsersTable />}
      </Box>
    </>
  );
}

export default AdminPage;
