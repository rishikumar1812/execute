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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  Send as SendIcon,
  InsertDriveFile as FileIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';

// Sample batch data for UI development
const SAMPLE_BATCH = [
  {
    transaction_id: "TX1234567",
    transaction_date: "2023-03-20",
    transaction_amount: 12000,
    transaction_channel: "web",
    transaction_payment_mode: "card",
    payment_gateway_bank: "Bank A",
    payer_email: "user1@example.com",
    payer_mobile: "1234567890",
    payee_id: "PAY100"
  },
  {
    transaction_id: "TX1234568",
    transaction_date: "2023-03-20",
    transaction_amount: 500,
    transaction_channel: "mobile",
    transaction_payment_mode: "upi",
    payment_gateway_bank: "Bank B",
    payer_email: "user2@example.com",
    payer_mobile: "9876543210",
    payee_id: "PAY101"
  },
  {
    transaction_id: "TX1234569",
    transaction_date: "2023-03-21",
    transaction_amount: 25000,
    transaction_channel: "web",
    transaction_payment_mode: "card",
    payment_gateway_bank: "Bank C",
    payer_email: "user3@example.com",
    payer_mobile: "5555555555",
    payee_id: "PAY102"
  }
];

const BatchDetection = () => {
  const [batchData, setBatchData] = useState('');
  const [parsedBatch, setParsedBatch] = useState([]);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  
  const handleBatchDataChange = (e) => {
    setBatchData(e.target.value);
    try {
      const parsed = JSON.parse(e.target.value);
      if (Array.isArray(parsed)) {
        setParsedBatch(parsed);
      } else {
        setParsedBatch([parsed]); // Single transaction, wrap in array
      }
    } catch (err) {
      // Invalid JSON, clear parsed data
      setParsedBatch([]);
    }
  };
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target.result;
        setBatchData(content);
        
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          setParsedBatch(parsed);
        } else {
          setParsedBatch([parsed]); // Single transaction, wrap in array
        }
        
        setFileUploaded(true);
        setError(null);
      } catch (err) {
        setError('Invalid JSON file format');
        setBatchData('');
        setParsedBatch([]);
      }
    };
    
    reader.onerror = () => {
      setError('Error reading file');
    };
    
    reader.readAsText(file);
  };
  
  const clearFile = () => {
    setBatchData('');
    setParsedBatch([]);
    setFileUploaded(false);
    setFileName('');
    setError(null);
  };
  
  const loadSampleBatch = () => {
    const sampleData = JSON.stringify(SAMPLE_BATCH, null, 2);
    setBatchData(sampleData);
    setParsedBatch(SAMPLE_BATCH);
    setError(null);
  };
  
  const handleSubmit = async () => {
    if (parsedBatch.length === 0) {
      setError('No valid transactions to process');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      // In a real app, we would call the API
      // const response = await axios.post('/api/detection/batch', parsedBatch);
      // setResults(response.data);
      
      // For now, simulate API call with a mock response
      await new Promise(resolve => setTimeout(resolve, 1500)); // simulate longer network delay for batch
      
      // Simulate fraud detection based on amount
      const mockResults = {};
      parsedBatch.forEach(transaction => {
        const isFraud = parseFloat(transaction.transaction_amount) > 10000;
        mockResults[transaction.transaction_id] = {
          is_fraud: isFraud,
          fraud_reason: isFraud ? 'Transaction amount exceeds threshold' : 'No fraud detected',
          fraud_score: isFraud ? 0.85 : 0.15
        };
      });
      
      setResults(mockResults);
      
    } catch (err) {
      console.error('Batch detection error:', err);
      setError(err.message || 'An error occurred while processing the transactions');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Batch Fraud Detection
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Submit Multiple Transactions for Fraud Detection
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Upload a JSON file or paste JSON data containing an array of transactions.
        </Typography>
        
        <Divider sx={{ my: 2 }} />
        
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              color="primary"
            >
              Upload JSON File
              <input
                type="file"
                accept=".json"
                hidden
                onChange={handleFileUpload}
              />
            </Button>
            {fileUploaded && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                <FileIcon fontSize="small" sx={{ mr: 1 }} />
                <Typography variant="body2">{fileName}</Typography>
                <IconButton size="small" onClick={clearFile} sx={{ ml: 1 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'right' }}>
            <Button 
              variant="outlined" 
              color="primary" 
              onClick={loadSampleBatch}
            >
              Load Sample Batch
            </Button>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Batch JSON Data"
              value={batchData}
              onChange={handleBatchDataChange}
              multiline
              rows={10}
              margin="normal"
              variant="outlined"
              InputProps={{
                style: { fontFamily: 'monospace' }
              }}
              placeholder="Paste JSON array of transactions here or upload a file"
            />
          </Grid>
        </Grid>
        
        {parsedBatch.length > 0 && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">
              Transactions to Process: {parsedBatch.length}
            </Typography>
          </Box>
        )}
        
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button 
            variant="outlined" 
            color="inherit" 
            onClick={clearFile}
            sx={{ mr: 1 }}
          >
            Clear
          </Button>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSubmit}
            disabled={loading || parsedBatch.length === 0}
            startIcon={loading ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {loading ? 'Processing Batch...' : 'Detect Fraud in Batch'}
          </Button>
        </Box>
      </Paper>
      
      {/* Errors */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>Error</AlertTitle>
          {error}
        </Alert>
      )}
      
      {/* Results */}
      {results && (
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Batch Detection Results
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Transaction ID</TableCell>
                  <TableCell>Fraud Status</TableCell>
                  <TableCell>Fraud Score</TableCell>
                  <TableCell>Reason</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.entries(results).map(([transactionId, result]) => (
                  <TableRow key={transactionId}>
                    <TableCell>{transactionId}</TableCell>
                    <TableCell>
                      <Chip 
                        label={result.is_fraud ? 'Fraud' : 'Legitimate'} 
                        color={result.is_fraud ? 'error' : 'success'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography 
                        color={result.fraud_score > 0.5 ? 'error.main' : 'success.main'}
                      >
                        {result.fraud_score.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>{result.fraud_reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1">
              Summary: {Object.values(results).filter(r => r.is_fraud).length} fraudulent transactions detected out of {Object.keys(results).length} total
            </Typography>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default BatchDetection; 