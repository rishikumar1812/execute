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
  Accordion,
  AccordionSummary,
  AccordionDetails
} from '@mui/material';
import {
  Send as SendIcon,
  ExpandMore as ExpandMoreIcon,
  Check as CheckIcon,
  Warning as WarningIcon
} from '@mui/icons-material';

const FraudDetection = () => {
  const [transactionData, setTransactionData] = useState({
    transaction_id: '',
    transaction_date: new Date().toISOString().split('T')[0],
    transaction_amount: '',
    transaction_channel: '',
    transaction_payment_mode: '',
    payment_gateway_bank: '',
    payer_email: '',
    payer_mobile: '',
    payer_card_brand: '',
    payer_device: '',
    payer_browser: '',
    payee_id: ''
  });
  
  const [jsonInput, setJsonInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [inputMode, setInputMode] = useState('form'); // 'form' or 'json'
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTransactionData({
      ...transactionData,
      [name]: value
    });
  };
  
  const handleJsonInputChange = (e) => {
    setJsonInput(e.target.value);
  };
  
  // Sample transaction JSON for quick testing
  const sampleJson = JSON.stringify({
    transaction_id: `TX${Date.now()}`,
    transaction_date: new Date().toISOString().split('T')[0],
    transaction_amount: 15000,
    transaction_channel: 'web',
    transaction_payment_mode: 'card',
    payment_gateway_bank: 'Bank A',
    payer_email: 'user@example.com',
    payer_mobile: '1234567890',
    payer_card_brand: 'Visa',
    payer_device: 'iPhone',
    payer_browser: 'Chrome',
    payee_id: 'PAY123'
  }, null, 2);
  
  const loadSampleJson = () => {
    setJsonInput(sampleJson);
  };
  
  const handleSubmit = async () => {
    setError(null);
    setLoading(true);
    
    try {
      let dataToSubmit;
      
      if (inputMode === 'form') {
        // Validate required fields
        const requiredFields = ['transaction_id', 'transaction_date', 'transaction_amount', 
                               'transaction_channel', 'transaction_payment_mode', 'payee_id'];
        
        for (const field of requiredFields) {
          if (!transactionData[field]) {
            throw new Error(`${field.replace('_', ' ')} is required`);
          }
        }
        
        dataToSubmit = transactionData;
      } else {
        // Parse JSON input
        try {
          dataToSubmit = JSON.parse(jsonInput);
        } catch (e) {
          throw new Error('Invalid JSON format');
        }
      }
      
      // In a real app, we would call the API
      // const response = await axios.post('/api/detection/realtime', dataToSubmit);
      // setResult(response.data);
      
      // For now, simulate API call with a mock response
      await new Promise(resolve => setTimeout(resolve, 800)); // simulate network delay
      
      // Simulate fraud detection based on amount
      const isFraud = parseFloat(dataToSubmit.transaction_amount) > 10000;
      
      setResult({
        transaction_id: dataToSubmit.transaction_id,
        is_fraud: isFraud,
        fraud_source: isFraud ? 'rule' : null,
        fraud_reason: isFraud ? 'Transaction amount exceeds threshold' : 'No fraud detected',
        fraud_score: isFraud ? 0.85 : 0.15
      });
      
    } catch (err) {
      console.error('Fraud detection error:', err);
      setError(err.message || 'An error occurred while processing the transaction');
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setTransactionData({
      transaction_id: '',
      transaction_date: new Date().toISOString().split('T')[0],
      transaction_amount: '',
      transaction_channel: '',
      transaction_payment_mode: '',
      payment_gateway_bank: '',
      payer_email: '',
      payer_mobile: '',
      payer_card_brand: '',
      payer_device: '',
      payer_browser: '',
      payee_id: ''
    });
    setJsonInput('');
    setResult(null);
    setError(null);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Real-time Fraud Detection
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Submit Transaction for Fraud Detection
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Enter transaction details to check for potential fraud.
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Button 
            variant={inputMode === 'form' ? 'contained' : 'outlined'} 
            color="primary"
            onClick={() => setInputMode('form')}
            sx={{ mr: 1 }}
          >
            Form Input
          </Button>
          <Button 
            variant={inputMode === 'json' ? 'contained' : 'outlined'} 
            color="primary"
            onClick={() => setInputMode('json')}
          >
            JSON Input
          </Button>
        </Box>
        
        <Divider sx={{ my: 2 }} />
        
        {inputMode === 'form' ? (
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Transaction ID"
                name="transaction_id"
                value={transactionData.transaction_id}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Transaction Date"
                name="transaction_date"
                type="date"
                value={transactionData.transaction_date}
                onChange={handleInputChange}
                required
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Amount"
                name="transaction_amount"
                type="number"
                value={transactionData.transaction_amount}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Channel (web, mobile, etc.)"
                name="transaction_channel"
                value={transactionData.transaction_channel}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Payment Mode (card, upi, etc.)"
                name="transaction_payment_mode"
                value={transactionData.transaction_payment_mode}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Gateway Bank"
                name="payment_gateway_bank"
                value={transactionData.payment_gateway_bank}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Payer Email"
                name="payer_email"
                type="email"
                value={transactionData.payer_email}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Payer Mobile"
                name="payer_mobile"
                value={transactionData.payer_mobile}
                onChange={handleInputChange}
                margin="normal"
              />
            </Grid>
            
            <Grid item xs={12}>
              <Accordion>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography>Advanced Details (Optional)</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Payer Card Brand"
                        name="payer_card_brand"
                        value={transactionData.payer_card_brand}
                        onChange={handleInputChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Payer Device"
                        name="payer_device"
                        value={transactionData.payer_device}
                        onChange={handleInputChange}
                        margin="normal"
                      />
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <TextField
                        fullWidth
                        label="Payer Browser"
                        name="payer_browser"
                        value={transactionData.payer_browser}
                        onChange={handleInputChange}
                        margin="normal"
                      />
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Payee ID"
                name="payee_id"
                value={transactionData.payee_id}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
          </Grid>
        ) : (
          <Box>
            <TextField
              fullWidth
              label="Transaction JSON"
              value={jsonInput}
              onChange={handleJsonInputChange}
              multiline
              rows={15}
              margin="normal"
              variant="outlined"
              InputProps={{
                style: { fontFamily: 'monospace' }
              }}
            />
            <Button 
              variant="text" 
              color="primary" 
              onClick={loadSampleJson}
              sx={{ mt: 1 }}
            >
              Load Sample JSON
            </Button>
          </Box>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={resetForm}
            sx={{ mr: 1 }}
          >
            Reset
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {loading ? 'Processing...' : 'Detect Fraud'}
          </Button>
        </Box>
      </Paper>
      
      {/* Results */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      {result && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Fraud Detection Result
          </Typography>
          <Box 
            sx={{ 
              p: 2, 
              borderRadius: 1, 
              bgcolor: result.is_fraud ? 'error.light' : 'success.light',
              mb: 2
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {result.is_fraud ? (
                <WarningIcon color="error" sx={{ mr: 1 }} />
              ) : (
                <CheckIcon color="success" sx={{ mr: 1 }} />
              )}
              <Typography variant="h6" color={result.is_fraud ? 'error' : 'success'}>
                {result.is_fraud ? 'Fraud Detected' : 'Transaction Appears Legitimate'}
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {result.fraud_reason}
            </Typography>
          </Box>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Transaction ID</Typography>
              <Typography variant="body1" gutterBottom>{result.transaction_id}</Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2">Fraud Score</Typography>
              <Typography 
                variant="body1" 
                gutterBottom
                color={result.fraud_score > 0.5 ? 'error.main' : 'success.main'}
              >
                {result.fraud_score.toFixed(2)} 
                {result.fraud_score > 0.7 ? ' (High Risk)' : 
                 result.fraud_score > 0.4 ? ' (Medium Risk)' : ' (Low Risk)'}
              </Typography>
            </Grid>
            {result.fraud_source && (
              <Grid item xs={12}>
                <Typography variant="subtitle2">Detection Source</Typography>
                <Typography variant="body1" gutterBottom>
                  {result.fraud_source === 'rule' ? 'Rule Engine' : 'AI Model'}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Paper>
      )}
    </Box>
  );
};

export default FraudDetection; 