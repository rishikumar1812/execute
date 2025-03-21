import React, { useState } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  TextField,
  Divider,
  CircularProgress,
  Alert,
  AlertTitle,
  Snackbar
} from '@mui/material';
import {
  Report as ReportIcon,
  CheckCircle as SuccessIcon
} from '@mui/icons-material';

const ReportFraud = () => {
  const [formData, setFormData] = useState({
    transaction_id: '',
    reporting_entity_id: '',
    fraud_details: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [response, setResponse] = useState(null);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.transaction_id || !formData.reporting_entity_id) {
      setError('Transaction ID and Reporting Entity ID are required');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // In a real app, we would call the API
      // const response = await axios.post('/api/detection/report', formData);
      // setResponse(response.data);
      
      // For now, simulate API call with a mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay
      
      setResponse({
        transaction_id: formData.transaction_id,
        reporting_acknowledged: true,
        failure_code: 0
      });
      
      setSuccess(true);
      
      // Reset form after successful submission
      setFormData({
        transaction_id: '',
        reporting_entity_id: '',
        fraud_details: ''
      });
      
    } catch (err) {
      console.error('Fraud reporting error:', err);
      setError(err.message || 'An error occurred while reporting the fraud');
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };
  
  const handleCloseSnackbar = () => {
    setSuccess(false);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Report a Fraudulent Transaction
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Fraud Report Form
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Use this form to report a transaction you believe to be fraudulent.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Transaction ID"
                name="transaction_id"
                value={formData.transaction_id}
                onChange={handleInputChange}
                required
                margin="normal"
                placeholder="Enter the ID of the fraudulent transaction"
                error={!!error && !formData.transaction_id}
                helperText={!!error && !formData.transaction_id ? 'Transaction ID is required' : ''}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Reporting Entity ID"
                name="reporting_entity_id"
                value={formData.reporting_entity_id}
                onChange={handleInputChange}
                required
                margin="normal"
                placeholder="Enter your entity ID (bank, merchant, etc.)"
                error={!!error && !formData.reporting_entity_id}
                helperText={!!error && !formData.reporting_entity_id ? 'Reporting Entity ID is required' : ''}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Fraud Details"
                name="fraud_details"
                value={formData.fraud_details}
                onChange={handleInputChange}
                multiline
                rows={4}
                margin="normal"
                placeholder="Provide details about why you believe this transaction is fraudulent"
              />
            </Grid>
          </Grid>
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit"
              variant="contained" 
              color="error" 
              disabled={loading}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ReportIcon />}
            >
              {loading ? 'Submitting...' : 'Report Fraud'}
            </Button>
          </Box>
        </form>
      </Paper>
      
      {/* Error message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      {/* Response details */}
      {response && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Report Submission Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Transaction ID</Typography>
              <Typography variant="body1" gutterBottom>{response.transaction_id}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Status</Typography>
              <Typography 
                variant="body1" 
                gutterBottom
                color={response.reporting_acknowledged ? 'success.main' : 'error.main'}
              >
                {response.reporting_acknowledged ? 'Acknowledged' : 'Failed'}
              </Typography>
            </Grid>
            {response.failure_code > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Failure Code</Typography>
                <Typography variant="body1" gutterBottom color="error.main">
                  {response.failure_code}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
      
      {/* Success notification */}
      <Snackbar
        open={success}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success"
          icon={<SuccessIcon />}
          sx={{ width: '100%' }}
        >
          Fraud report submitted successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ReportFraud; 