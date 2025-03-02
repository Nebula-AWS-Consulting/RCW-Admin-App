import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';

interface AuthenticationResult {
  IdToken: string;
  AccessToken: string;
  RefreshToken: string;
}

interface SignInPayload {
  username: string;
  password: string;
}

interface SignUpPayload {
  firstName: string;
  lastName: string;
  password: string;
  email: string;
}

interface AuthState {
  token: string | null;
  user: any;
  loading: boolean;
  error: string | null;
  isLoggedIn: boolean;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
  isLoggedIn: false
};

// Async thunk for sign in using fetch
export const signIn = createAsyncThunk<
  AuthenticationResult,
  SignInPayload,
  { rejectValue: { error: string } }
>('auth/signIn', async ({ username, password }, { rejectWithValue }) => {
  try {
    const response = await fetch('https://92vq2x6u1b.execute-api.us-west-1.amazonaws.com/Prod/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const json = await response.json();
    console.log('Raw signIn response:', json);
    if (!response.ok) {
      return rejectWithValue({ error: json.error || 'Sign in failed' });
    }
    // If the tokens are nested inside AuthenticationResult, adjust here:
    if (json.AuthenticationResult) {
      return json.AuthenticationResult;
    }
    return json;
  } catch (error: any) {
    return rejectWithValue({ error: error.message || 'Sign in failed' });
  }
});

// Async thunk for sign up using fetch
export const signUp = createAsyncThunk<
  any,
  SignUpPayload,
  { rejectValue: { error: string } }
>('auth/signUp', async ({ firstName, lastName, password, email }, { rejectWithValue }) => {
  try {
    const response = await fetch('https://92vq2x6u1b.execute-api.us-west-1.amazonaws.com/Prod/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ firstName, lastName, password, email }),
    });
    if (!response.ok) {
      const errorData = await response.json();
      return rejectWithValue({ error: errorData.error || 'Sign up failed' });
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    return rejectWithValue({ error: error.message || 'Sign up failed' });
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signOut(state) {
      state.token = null;
      state.user = null;
      state.isLoggedIn = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In Cases
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<AuthenticationResult>) => {
        state.loading = false;
        state.token = action.payload.IdToken;
        state.user = action.payload;
        state.isLoggedIn = true
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.error || action.error.message || 'Sign in failed';
      })
      // Sign Up Cases
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.error || action.error.message || 'Sign up failed';
      })
      .addCase(REHYDRATE, (state) => {
        if (state.user) {
          state.isLoggedIn = true
        }
      })
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;