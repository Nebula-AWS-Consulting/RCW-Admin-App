import { useState } from 'react';

import { LoadingButton } from '@mui/lab';
import { Box, Card, MenuItem, TextField, Typography } from '@mui/material';

export function AnalyticsTransactionForm() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    const data = new FormData(event.currentTarget);
    
    // Extract and trim the user_name and amount_value fields.
    const userName = (data.get('user_name') as string)?.trim() || "";
    const amountStr = (data.get('amount_value') as string)?.trim() || "";
    
    // Validate that the user name is not empty.
    if (!userName) {
        console.error("User Name is required.");
        // Optionally, set error state to display a message in the UI.
        return;
    }
    
    // Validate that the amount is not empty.
    if (!amountStr) {
        console.error("Amount Value is required.");
        return;
    }
    
    // Regular expression to match a valid USD number (e.g., "10", "10.5", "10.50")
    const usdRegex = /^\d+(\.\d{1,2})?$/;
    
    // Validate amount format
    if (!usdRegex.test(amountStr)) {
        console.error("Invalid amount format. Please enter a valid USD number (e.g., 10, 10.50).");
        return;
    }
    
    // Convert the amount to a number and ensure it's positive.
    const amountValue = parseFloat(amountStr);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
        console.error("Amount must be a positive number.");
        return;
    }
    
    const transactionData = {
        user_name: userName,
        amount_value: Number(amountValue).toFixed(2), // Use the validated numeric value
        purpose: data.get('purpose'),
        currency: data.get('currency'),
    };
    
    try {
      const response = await fetch('https://cto3b5zoi7.execute-api.us-west-1.amazonaws.com/Prod/upload-item', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(transactionData),
      });
      
      if (response.ok) {
        console.log('Transaction submitted successfully');
      } else {
        console.error('Failed to submit transaction');
        }
    } catch (error) {
        console.error('Error submitting transaction:', error);
    }
    finally {
        (event.target as HTMLFormElement).reset();
        setIsLoading(false);
    }
  };
  
  const renderForm = (
    <Box component="form" display="flex" flexDirection="column" alignItems="flex-end" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        name="user_name"
        label="Donator's Name"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        required
      />
      <TextField
        fullWidth
        name="amount_value"
        label="Amount"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        required
      />
      {/* Purpose select field */}
      <TextField
        select
        fullWidth
        name="purpose"
        label="Purpose"
        defaultValue="Contribution"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      >
        <MenuItem value="Contribution">Contribution</MenuItem>
        <MenuItem value="Benevolence">Benevolence</MenuItem>
        <MenuItem value="Missions">Missions</MenuItem>
      </TextField>
      {/* Currency select field */}
      <TextField
        select
        fullWidth
        name="currency"
        label="Currency"
        defaultValue="USD"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      >
        <MenuItem value="USD">USD</MenuItem>
        <MenuItem value="EUR">EUR</MenuItem>
        <MenuItem value="GBP">GBP</MenuItem>
        <MenuItem value="CAD">CAD</MenuItem>
      </TextField>
      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        loading={isLoading}
      >
        Submit Transaction
      </LoadingButton>
    </Box>
  );
  

  return (
    <Card sx={{ padding: 4 }}>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Church Transaction Form</Typography>
      </Box>
      {renderForm}
    </Card>
  );
}