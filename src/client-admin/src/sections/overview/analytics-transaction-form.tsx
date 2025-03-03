import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { Box, Card, MenuItem, TextField, Typography } from '@mui/material';

export function AnalyticsTransactionForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    const data = new FormData(event.currentTarget);
    const userName = (data.get('user_name') as string)?.trim() || "";
    const amountStr = (data.get('amount_value') as string)?.trim() || "";
    
    if (!userName) {
      setErrorMessage("Please enter your name.");
      setIsLoading(false);
      return;
    }
    
    if (!amountStr) {
      setErrorMessage("Please enter an amount.");
      setIsLoading(false);
      return;
    }
    
    const amountValue = parseFloat(amountStr);
    if (Number.isNaN(amountValue) || amountValue <= 0) {
      setErrorMessage("The amount must be a positive number.");
      setIsLoading(false);
      return;
    }
    
    const transactionData = {
      user_name: userName,
      amount_value: Number(amountValue).toFixed(2),
      purpose: data.get('purpose'),
      currency: data.get('currency'),
    };
    
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_LINK}upload-cash-transaction`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transactionData),
        }
      );
      
      if (response.ok) {
        setSuccessMessage("Transaction submitted successfully!");
      } else {
        setErrorMessage("Sorry, we couldn't submit your transaction. Please try again.");
      }
    } catch (error) {
      setErrorMessage("An error occurred while submitting your transaction. Please try again later.");
    } finally {
      (event.target as HTMLFormElement).reset();
      setIsLoading(false);
    }
  };

  return (
    <Card sx={{ padding: 4 }}>
      <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h5">Church Transaction Form</Typography>
      </Box>
      <Box
        component="form"
        display="flex"
        flexDirection="column"
        alignItems="flex-end"
        onSubmit={handleSubmit}
        noValidate
      >
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
        {errorMessage && (
          <Typography variant="body2" color="error" sx={{ mb: 2 }}>
            {errorMessage}
          </Typography>
        )}
        {successMessage && (
          <Typography variant="body2" color="success.main" sx={{ mb: 2 }}>
            {successMessage}
          </Typography>
        )}
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
    </Card>
  );
}
