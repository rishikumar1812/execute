import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';

// Import components and pages
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import RuleEngine from './pages/RuleEngine';
import FraudDetection from './pages/FraudDetection';
import BatchDetection from './pages/BatchDetection';
import ReportFraud from './pages/ReportFraud';

// Create MUI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar />
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/rule-engine" element={<RuleEngine />} />
            <Route path="/fraud-detection" element={<FraudDetection />} />
            <Route path="/batch-detection" element={<BatchDetection />} />
            <Route path="/report-fraud" element={<ReportFraud />} />
          </Routes>
        </Container>
      </Router>
    </ThemeProvider>
  );
}

export default App;
