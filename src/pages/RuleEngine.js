import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Grid, 
  TextField, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemSecondaryAction, 
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Divider
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowUpward as PriorityUpIcon,
  ArrowDownward as PriorityDownIcon
} from '@mui/icons-material';

// Mock data for initial UI development
const MOCK_RULES = [
  {
    _id: '1',
    name: 'Large Amount Transaction',
    description: 'Flag transactions with unusually large amounts',
    conditions: {
      all: [
        {
          fact: 'transaction_amount',
          operator: 'greaterThan',
          value: 10000
        }
      ]
    },
    event: {
      type: 'fraud',
      params: {
        message: 'Transaction amount exceeds threshold',
        score: 0.7
      }
    },
    priority: 10,
    active: true
  },
  {
    _id: '2',
    name: 'Unusual Device and Browser',
    description: 'Detect transactions from unusual device and browser combinations',
    conditions: {
      all: [
        {
          fact: 'payer_device',
          operator: 'contains',
          value: 'unknown'
        },
        {
          fact: 'payer_browser',
          operator: 'contains',
          value: 'outdated'
        }
      ]
    },
    event: {
      type: 'fraud',
      params: {
        message: 'Unusual device and browser combination',
        score: 0.8
      }
    },
    priority: 5,
    active: true
  },
  {
    _id: '3',
    name: 'Multiple Web Card Transactions',
    description: 'Flag multiple transactions from the same channel in short time',
    conditions: {
      all: [
        {
          fact: 'transaction_channel',
          operator: 'equal',
          value: 'web'
        },
        {
          fact: 'transaction_payment_mode',
          operator: 'equal',
          value: 'card'
        }
      ]
    },
    event: {
      type: 'fraud',
      params: {
        message: 'Multiple web transactions in short time',
        score: 0.5
      }
    },
    priority: 3,
    active: false
  }
];

const RuleEngine = () => {
  const [rules, setRules] = useState(MOCK_RULES);
  const [selectedRule, setSelectedRule] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState('add'); // 'add' or 'edit'
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    conditionsJson: '',
    eventJson: '',
    priority: 1,
    active: true
  });
  
  useEffect(() => {
    // In a real app, we would fetch rules from the API
    // axios.get('/api/rules')
    //   .then(res => setRules(res.data))
    //   .catch(err => {
    //     console.error(err);
    //     setSnackbar({
    //       open: true,
    //       message: 'Failed to load rules',
    //       severity: 'error'
    //     });
    //   });
  }, []);
  
  const handleOpenDialog = (mode, rule = null) => {
    setDialogMode(mode);
    
    if (mode === 'edit' && rule) {
      setSelectedRule(rule);
      setFormData({
        name: rule.name,
        description: rule.description || '',
        conditionsJson: JSON.stringify(rule.conditions, null, 2),
        eventJson: JSON.stringify(rule.event, null, 2),
        priority: rule.priority,
        active: rule.active
      });
    } else {
      // Default values for new rule
      setSelectedRule(null);
      setFormData({
        name: '',
        description: '',
        conditionsJson: JSON.stringify({
          all: [
            {
              fact: 'transaction_amount',
              operator: 'greaterThan',
              value: 1000
            }
          ]
        }, null, 2),
        eventJson: JSON.stringify({
          type: 'fraud',
          params: {
            message: 'Suspicious activity detected',
            score: 0.5
          }
        }, null, 2),
        priority: 1,
        active: true
      });
    }
    
    setIsDialogOpen(true);
  };
  
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };
  
  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'active' ? checked : value
    });
  };
  
  const handleSubmit = () => {
    try {
      // Parse JSON inputs
      const conditions = JSON.parse(formData.conditionsJson);
      const event = JSON.parse(formData.eventJson);
      
      // Construct rule object
      const ruleData = {
        name: formData.name,
        description: formData.description,
        conditions,
        event,
        priority: parseInt(formData.priority),
        active: formData.active
      };
      
      if (dialogMode === 'add') {
        // In a real app, we would call the API
        // axios.post('/api/rules', ruleData)
        //   .then(res => {
        //     setRules([...rules, res.data]);
        //     handleCloseDialog();
        //     setSnackbar({
        //       open: true,
        //       message: 'Rule added successfully',
        //       severity: 'success'
        //     });
        //   })
        //   .catch(err => {
        //     console.error(err);
        //     setSnackbar({
        //       open: true,
        //       message: 'Failed to add rule',
        //       severity: 'error'
        //     });
        //   });
        
        // For now, simulate adding a rule
        const newRule = {
          _id: Date.now().toString(),
          ...ruleData
        };
        setRules([...rules, newRule]);
        handleCloseDialog();
        setSnackbar({
          open: true,
          message: 'Rule added successfully',
          severity: 'success'
        });
      } else if (dialogMode === 'edit' && selectedRule) {
        // In a real app, we would call the API
        // axios.put(`/api/rules/${selectedRule._id}`, ruleData)
        //   .then(res => {
        //     setRules(rules.map(rule => rule._id === selectedRule._id ? res.data : rule));
        //     handleCloseDialog();
        //     setSnackbar({
        //       open: true,
        //       message: 'Rule updated successfully',
        //       severity: 'success'
        //     });
        //   })
        //   .catch(err => {
        //     console.error(err);
        //     setSnackbar({
        //       open: true,
        //       message: 'Failed to update rule',
        //       severity: 'error'
        //     });
        //   });
        
        // For now, simulate updating a rule
        const updatedRules = rules.map(rule => 
          rule._id === selectedRule._id ? { ...rule, ...ruleData } : rule
        );
        setRules(updatedRules);
        handleCloseDialog();
        setSnackbar({
          open: true,
          message: 'Rule updated successfully',
          severity: 'success'
        });
      }
    } catch (err) {
      console.error('JSON parsing error:', err);
      setSnackbar({
        open: true,
        message: 'Invalid JSON format',
        severity: 'error'
      });
    }
  };
  
  const handleDeleteRule = (ruleId) => {
    // In a real app, we would call the API
    // axios.delete(`/api/rules/${ruleId}`)
    //   .then(() => {
    //     setRules(rules.filter(rule => rule._id !== ruleId));
    //     setSnackbar({
    //       open: true,
    //       message: 'Rule deleted successfully',
    //       severity: 'success'
    //     });
    //   })
    //   .catch(err => {
    //     console.error(err);
    //     setSnackbar({
    //       open: true,
    //       message: 'Failed to delete rule',
    //       severity: 'error'
    //     });
    //   });
    
    // For now, simulate deleting a rule
    setRules(rules.filter(rule => rule._id !== ruleId));
    setSnackbar({
      open: true,
      message: 'Rule deleted successfully',
      severity: 'success'
    });
  };
  
  const handleToggleActive = (ruleId) => {
    const updatedRules = rules.map(rule => 
      rule._id === ruleId ? { ...rule, active: !rule.active } : rule
    );
    setRules(updatedRules);
    
    // In a real app, we would call the API
    // const toggledRule = rules.find(rule => rule._id === ruleId);
    // axios.put(`/api/rules/${ruleId}`, { ...toggledRule, active: !toggledRule.active })
    //   .catch(err => {
    //     console.error(err);
    //     setSnackbar({
    //       open: true,
    //       message: 'Failed to update rule',
    //       severity: 'error'
    //     });
    //     // Revert the change if API call fails
    //     setRules(rules);
    //   });
  };
  
  const handleChangePriority = (ruleId, direction) => {
    const ruleIndex = rules.findIndex(rule => rule._id === ruleId);
    if (ruleIndex === -1) return;
    
    const newRules = [...rules];
    const rule = newRules[ruleIndex];
    
    if (direction === 'up') {
      rule.priority += 1;
    } else if (direction === 'down') {
      rule.priority = Math.max(1, rule.priority - 1);
    }
    
    // Sort rules by priority (descending)
    newRules.sort((a, b) => b.priority - a.priority);
    setRules(newRules);
    
    // In a real app, we would call the API
    // axios.put(`/api/rules/${ruleId}`, { priority: rule.priority })
    //   .catch(err => {
    //     console.error(err);
    //     setSnackbar({
    //       open: true,
    //       message: 'Failed to update priority',
    //       severity: 'error'
    //     });
    //     // Revert the change if API call fails
    //     setRules(rules);
    //   });
  };
  
  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Fraud Detection Rule Engine
      </Typography>
      
      <Paper sx={{ p: 2, mb: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">
            Manage Rules
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog('add')}
          >
            Add New Rule
          </Button>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <List>
          {rules.length === 0 ? (
            <Typography variant="body1" sx={{ fontStyle: 'italic', textAlign: 'center', py: 2 }}>
              No rules defined. Click 'Add New Rule' to create one.
            </Typography>
          ) : (
            rules.map((rule) => (
              <ListItem 
                key={rule._id}
                sx={{ 
                  mb: 1, 
                  bgcolor: rule.active ? 'background.paper' : 'action.disabledBackground',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              >
                <ListItemText 
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Typography 
                        variant="subtitle1" 
                        sx={{ 
                          fontWeight: 'bold',
                          color: rule.active ? 'text.primary' : 'text.disabled'
                        }}
                      >
                        {rule.name}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          ml: 2,
                          color: 'text.secondary',
                          bgcolor: 'action.selected',
                          px: 1,
                          borderRadius: 1
                        }}
                      >
                        Priority: {rule.priority}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: rule.active ? 'text.secondary' : 'text.disabled'
                      }}
                    >
                      {rule.description || 'No description'}
                    </Typography>
                  }
                />
                <ListItemSecondaryAction>
                  <IconButton 
                    edge="end" 
                    aria-label="increase priority"
                    onClick={() => handleChangePriority(rule._id, 'up')}
                  >
                    <PriorityUpIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="decrease priority"
                    onClick={() => handleChangePriority(rule._id, 'down')}
                  >
                    <PriorityDownIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="edit"
                    onClick={() => handleOpenDialog('edit', rule)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    edge="end" 
                    aria-label="delete"
                    onClick={() => handleDeleteRule(rule._id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={rule.active}
                        onChange={() => handleToggleActive(rule._id)}
                        color="primary"
                      />
                    }
                    label={rule.active ? "Active" : "Inactive"}
                  />
                </ListItemSecondaryAction>
              </ListItem>
            ))
          )}
        </List>
      </Paper>
      
      {/* Add/Edit Rule Dialog */}
      <Dialog 
        open={isDialogOpen} 
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>
          {dialogMode === 'add' ? 'Add New Rule' : 'Edit Rule'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Rule Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Priority"
                name="priority"
                type="number"
                InputProps={{ inputProps: { min: 1 } }}
                value={formData.priority}
                onChange={handleInputChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} md={2}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.active}
                    onChange={handleInputChange}
                    name="active"
                    color="primary"
                  />
                }
                label="Active"
                sx={{ mt: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                multiline
                rows={2}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Conditions (JSON format)
              </Typography>
              <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
                Define the conditions that trigger this rule. Use the format:
                {` { "all": [ { "fact": "field_name", "operator": "comparison", "value": comparison_value } ] }`}
              </Typography>
              <TextField
                fullWidth
                name="conditionsJson"
                value={formData.conditionsJson}
                onChange={handleInputChange}
                multiline
                rows={8}
                margin="normal"
                variant="outlined"
                InputProps={{
                  style: { fontFamily: 'monospace' }
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>
                Event (JSON format)
              </Typography>
              <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
                Define the event that occurs when conditions are met. Use the format:
                {` { "type": "fraud", "params": { "message": "Your message", "score": 0.7 } }`}
              </Typography>
              <TextField
                fullWidth
                name="eventJson"
                value={formData.eventJson}
                onChange={handleInputChange}
                multiline
                rows={6}
                margin="normal"
                variant="outlined"
                InputProps={{
                  style: { fontFamily: 'monospace' }
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="inherit">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            {dialogMode === 'add' ? 'Add Rule' : 'Save Changes'}
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default RuleEngine; 