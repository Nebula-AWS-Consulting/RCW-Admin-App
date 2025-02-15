import Box from '@mui/material/Box';

import { Iconify } from 'src/components/iconify';

import { Card, IconButton, InputAdornment, Link, TextField, Typography } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useState } from 'react';

export function AnalyticsTransactionForm() {
    const [showPassword, setShowPassword] = useState(false);
  
    const renderForm = (
      <Box display="flex" flexDirection="column" alignItems="flex-end">
        <TextField
          fullWidth
          name="email"
          label="Email address"
          defaultValue="hello@gmail.com"
          InputLabelProps={{ shrink: true }}
          sx={{ mb: 3 }}
        />
  
        <Link variant="body2" color="inherit" sx={{ mb: 1.5 }}>
          Forgot password?
        </Link>
  
        <TextField
          fullWidth
          name="password"
          label="Password"
          defaultValue="@demo1234"
          InputLabelProps={{ shrink: true }}
          type={showPassword ? 'text' : 'password'}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                  <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />
  
        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          color="inherit"
          variant="contained"
        >
          Sign in
        </LoadingButton>
      </Box>
    );
  
    return (
      <Card sx={{
        padding: 4
      }}>
        <Box gap={1.5} display="flex" flexDirection="column" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h5">Church Transaction Form</Typography>
        </Box>
  
        {renderForm}
      </Card>
    );
}