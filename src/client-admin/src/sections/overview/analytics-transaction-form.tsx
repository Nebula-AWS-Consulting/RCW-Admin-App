import Box from '@mui/material/Box';
import { Card, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';

export function AnalyticsTransactionForm() {
  const renderForm = (
    <Box component="form" display="flex" flexDirection="column" alignItems="flex-end" noValidate>
        <TextField
          fullWidth
          name="user_name"
          label="User Name"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
      <TextField
        fullWidth
        name="amount_value"
        label="Amount Value"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name="purpose"
        label="Purpose"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name="currency"
        label="Currency"
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
      />
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