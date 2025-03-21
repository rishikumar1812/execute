import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box 
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Rule as RuleIcon,
  Search as SearchIcon,
  DynamicFeed as BatchIcon,
  Report as ReportIcon
} from '@mui/icons-material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Fraud Detection System
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            startIcon={<DashboardIcon />}
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/rule-engine"
            startIcon={<RuleIcon />}
          >
            Rule Engine
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/fraud-detection"
            startIcon={<SearchIcon />}
          >
            Detect Fraud
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/batch-detection"
            startIcon={<BatchIcon />}
          >
            Batch Detection
          </Button>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/report-fraud"
            startIcon={<ReportIcon />}
          >
            Report Fraud
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 