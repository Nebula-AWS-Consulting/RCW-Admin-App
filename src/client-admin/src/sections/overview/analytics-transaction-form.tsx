import Box from '@mui/material/Box';
import { Card, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';;
import MenuItem from '@mui/material/MenuItem';

export function AnalyticsTransactionForm() {

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const transactionData = {
      user_name: data.get('user_name'),
      amount_value: data.get('amount_value'),
      purpose: data.get('purpose'),
      currency: data.get('currency'),
    };

    console.log(transactionData)

    try {
      const response = await fetch('XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX', {
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
  };
  
  const renderForm = (
    <Box component="form" display="flex" flexDirection="column" alignItems="flex-end" onSubmit={handleSubmit} noValidate>
      <TextField
        fullWidth
        name="user_name"
        label="Donator's Name"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name="amount_value"
        label="Amount"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
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

// Form Fields
// id, data_type, currency, amount_value, create_time, net_amount, purpose, transaction_fee, user_email, user_name