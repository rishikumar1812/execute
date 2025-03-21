import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

// Mock data for initial UI development
const MOCK_TRANSACTIONS = [
  {
    transaction_id: 'TX123456',
    transaction_date: '2023-03-15',
    transaction_amount: 1500.00,
    transaction_channel: 'web',
    transaction_payment_mode: 'card',
    payment_gateway_bank: 'Bank A',
    payer_email: 'user@example.com',
    payer_mobile: '1234567890',
    payee_id: 'PYE123',
    is_fraud_predicted: false,
    is_fraud_reported: false
  },
  {
    transaction_id: 'TX123457',
    transaction_date: '2023-03-16',
    transaction_amount: 12000.00,
    transaction_channel: 'web',
    transaction_payment_mode: 'card',
    payment_gateway_bank: 'Bank B',
    payer_email: 'suspicious@example.com',
    payer_mobile: '0987654321',
    payee_id: 'PYE124',
    is_fraud_predicted: true,
    is_fraud_reported: true
  },
  {
    transaction_id: 'TX123458',
    transaction_date: '2023-03-16',
    transaction_amount: 500.00,
    transaction_channel: 'mobile',
    transaction_payment_mode: 'upi',
    payment_gateway_bank: 'Bank C',
    payer_email: 'normal@example.com',
    payer_mobile: '5555555555',
    payee_id: 'PYE125',
    is_fraud_predicted: false,
    is_fraud_reported: false
  }
];

// Mock data for charts
const MOCK_CHANNEL_DATA = [
  { name: 'Web', predicted: 25, reported: 20 },
  { name: 'Mobile', predicted: 15, reported: 10 },
  { name: 'In-store', predicted: 5, reported: 7 }
];

const MOCK_TIME_SERIES = [
  { date: '01/23', predicted: 5, reported: 3 },
  { date: '02/23', predicted: 7, reported: 5 },
  { date: '03/23', predicted: 10, reported: 8 },
  { date: '04/23', predicted: 8, reported: 7 },
  { date: '05/23', predicted: 12, reported: 10 }
];

// Confusion matrix calculation helper
const calculateConfusionMatrix = (data) => {
  let truePositive = 0;
  let falsePositive = 0;
  let trueNegative = 0;
  let falseNegative = 0;
  
  data.forEach(item => {
    if (item.is_fraud_predicted && item.is_fraud_reported) {
      truePositive++;
    } else if (item.is_fraud_predicted && !item.is_fraud_reported) {
      falsePositive++;
    } else if (!item.is_fraud_predicted && !item.is_fraud_reported) {
      trueNegative++;
    } else if (!item.is_fraud_predicted && item.is_fraud_reported) {
      falseNegative++;
    }
  });
  
  // Calculate metrics
  const precision = truePositive / (truePositive + falsePositive) || 0;
  const recall = truePositive / (truePositive + falseNegative) || 0;
  const f1Score = 2 * (precision * recall) / (precision + recall) || 0;
  
  return {
    matrix: [
      [truePositive, falsePositive],
      [falseNegative, trueNegative]
    ],
    precision: precision.toFixed(2),
    recall: recall.toFixed(2),
    f1Score: f1Score.toFixed(2)
  };
};

const Dashboard = () => {
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);
  const [filteredTransactions, setFilteredTransactions] = useState(MOCK_TRANSACTIONS);
  const [channelData, setChannelData] = useState(MOCK_CHANNEL_DATA);
  const [timeSeriesData, setTimeSeriesData] = useState(MOCK_TIME_SERIES);
  const [confusionData, setConfusionData] = useState(() => calculateConfusionMatrix(MOCK_TRANSACTIONS));
  
  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState({ start: '', end: '' });
  const [payerFilter, setPayerFilter] = useState('');
  const [payeeFilter, setPayeeFilter] = useState('');
  const [dimension, setDimension] = useState('transaction_channel');
  
  useEffect(() => {
    // In a real app, we would fetch data from the API
    // axios.get('/api/transactions')
    //   .then(res => {
    //     setTransactions(res.data);
    //     setFilteredTransactions(res.data);
    //     setConfusionData(calculateConfusionMatrix(res.data));
    //   })
    //   .catch(err => console.error(err));
  }, []);
  
  // Apply filters
  useEffect(() => {
    let results = transactions;
    
    if (searchTerm) {
      results = results.filter(tx => 
        tx.transaction_id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (dateFilter.start) {
      results = results.filter(tx => 
        new Date(tx.transaction_date) >= new Date(dateFilter.start)
      );
    }
    
    if (dateFilter.end) {
      results = results.filter(tx => 
        new Date(tx.transaction_date) <= new Date(dateFilter.end)
      );
    }
    
    if (payerFilter) {
      results = results.filter(tx => 
        tx.payer_email.toLowerCase().includes(payerFilter.toLowerCase())
      );
    }
    
    if (payeeFilter) {
      results = results.filter(tx => 
        tx.payee_id.toLowerCase().includes(payeeFilter.toLowerCase())
      );
    }
    
    setFilteredTransactions(results);
    setConfusionData(calculateConfusionMatrix(results));
  }, [transactions, searchTerm, dateFilter, payerFilter, payeeFilter]);
  
  // Pagination handlers
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Transaction and Fraud Monitoring Dashboard
      </Typography>
      
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              fullWidth
              label="Search by Transaction ID"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Start Date"
              type="date"
              value={dateFilter.start}
              onChange={(e) => setDateFilter({ ...dateFilter, start: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="End Date"
              type="date"
              value={dateFilter.end}
              onChange={(e) => setDateFilter({ ...dateFilter, end: e.target.value })}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Payer Email/ID"
              value={payerFilter}
              onChange={(e) => setPayerFilter(e.target.value)}
            />
          </Grid>
          <Grid item xs={6} md={2}>
            <TextField
              fullWidth
              label="Payee ID"
              value={payeeFilter}
              onChange={(e) => setPayeeFilter(e.target.value)}
            />
          </Grid>
        </Grid>
      </Paper>
      
      {/* Transactions Table */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Transaction Data
        </Typography>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Transaction ID</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Channel</TableCell>
                <TableCell>Payment Mode</TableCell>
                <TableCell>Payer Email</TableCell>
                <TableCell>Payee ID</TableCell>
                <TableCell>Predicted Fraud</TableCell>
                <TableCell>Reported Fraud</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredTransactions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((tx) => (
                <TableRow key={tx.transaction_id}>
                  <TableCell>{tx.transaction_id}</TableCell>
                  <TableCell>{tx.transaction_date}</TableCell>
                  <TableCell>${tx.transaction_amount.toFixed(2)}</TableCell>
                  <TableCell>{tx.transaction_channel}</TableCell>
                  <TableCell>{tx.transaction_payment_mode}</TableCell>
                  <TableCell>{tx.payer_email}</TableCell>
                  <TableCell>{tx.payee_id}</TableCell>
                  <TableCell>{tx.is_fraud_predicted ? 'Yes' : 'No'}</TableCell>
                  <TableCell>{tx.is_fraud_reported ? 'Yes' : 'No'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredTransactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Dimension Analysis */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Fraud by Dimension
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Group By</InputLabel>
              <Select
                value={dimension}
                label="Group By"
                onChange={(e) => setDimension(e.target.value)}
              >
                <MenuItem value="transaction_channel">Channel</MenuItem>
                <MenuItem value="transaction_payment_mode">Payment Mode</MenuItem>
                <MenuItem value="payment_gateway_bank">Gateway Bank</MenuItem>
                <MenuItem value="payee_id">Payee</MenuItem>
              </Select>
            </FormControl>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="predicted" fill="#8884d8" name="Predicted Fraud" />
                <Bar dataKey="reported" fill="#82ca9d" name="Reported Fraud" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        
        {/* Time Series */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Fraud Over Time
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={timeSeriesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="predicted" stroke="#8884d8" name="Predicted Fraud" />
                <Line type="monotone" dataKey="reported" stroke="#82ca9d" name="Reported Fraud" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Confusion Matrix */}
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="h6" gutterBottom>
          Fraud Detection Evaluation
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell></TableCell>
                    <TableCell>Predicted Fraud</TableCell>
                    <TableCell>Predicted Not Fraud</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Actual Fraud</TableCell>
                    <TableCell>{confusionData.matrix[0][0]} (TP)</TableCell>
                    <TableCell>{confusionData.matrix[1][0]} (FN)</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Actual Not Fraud</TableCell>
                    <TableCell>{confusionData.matrix[0][1]} (FP)</TableCell>
                    <TableCell>{confusionData.matrix[1][1]} (TN)</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body1">
              Precision: {confusionData.precision} (How many predicted frauds were actually frauds)
            </Typography>
            <Typography variant="body1">
              Recall: {confusionData.recall} (How many actual frauds were detected)
            </Typography>
            <Typography variant="body1">
              F1 Score: {confusionData.f1Score} (Balance between precision and recall)
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default Dashboard; 