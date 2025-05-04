// components/TopNavigation.js
import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import InstructorDashboard from '../components/InstructorDashboard';

function TopNavigation({
  title = 'Dashboard',
  tabs = [],
  selectedTab = null,
  onTabChange = null,
  showTabs = false,
  backgroundColor = '#ffffff',
  textColor = '#000',
}) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor, color: textColor, boxShadow: 3 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>

        {showTabs && tabs.length > 0 && (
          <Tabs
            value={selectedTab}
            onChange={onTabChange}
            textColor="inherit"
            indicatorColor="secondary"
            sx={{
              flexGrow: 1,
              marginLeft: 4,
              '& .MuiTabs-flexContainer': {
                display: 'flex',
                justifyContent: 'space-around',
              },
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} label={tab.label} icon={tab.icon} />
            ))}
            <Tab
              label="Dashboard"
              onClick={() => navigate('/instructor-dashboard')}
            />
          </Tabs>
        )}

        <Button
        variant="contained"
        sx={{
            backgroundColor: '#2D5BFF', // Deep blue color
            color: '#fff', // White text color
            '&:hover': {
            backgroundColor: '#1a46b8', // Slightly darker blue on hover
            },
            marginLeft: 2,
        }}
        onClick={handleLogout}
        >
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default TopNavigation;
