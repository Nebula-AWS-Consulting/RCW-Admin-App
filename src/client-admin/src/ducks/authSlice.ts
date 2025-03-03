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

interface AuthPayload {
  tokens: AuthenticationResult;
  user: any;
}

interface AuthState {
  token: string | null;
  user: any;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: false,
  error: null,
};

// Async thunk for sign in that calls the sign in API and then the get user API
export const signIn = createAsyncThunk<
  AuthPayload,
  SignInPayload,
  { rejectValue: { error: string } }
>('auth/signIn', async ({ username, password }, { rejectWithValue }) => {
  try {
    // Call the sign-in API
    const response = await fetch(
      `${import.meta.env.VITE_API_LINK}signin`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      }
    );
    const json = await response.json();
    if (!response.ok) {
      return rejectWithValue({ error: json.error || 'Sign in failed' });
    }
    // Extract tokens from the response (adjust if nested differently)
    const tokens = json.AuthenticationResult ? json.AuthenticationResult : json;

    // Now call the get user API with the AccessToken
    const userResponse = await fetch(
      `${import.meta.env.VITE_API_LINK}getuser`, // Change to getuser later
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: tokens.AccessToken }),
      }
    );
    const userJson = await userResponse.json();
    if (!userResponse.ok) {
      return rejectWithValue({ error: userJson.error || 'Failed to get user data' });
    }

    // Return both the tokens and the user attributes
    return { tokens, user: userJson };
  } catch (error: any) {
    return rejectWithValue({ error: error.message || 'Sign in failed' });
  }
});

// Async thunk for sign up using fetch (unchanged)
export const signUp = createAsyncThunk<
  any,
  SignUpPayload,
  { rejectValue: { error: string } }
>('auth/signUp', async ({ firstName, lastName, password, email }, { rejectWithValue }) => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_LINK}signup`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, password, email }),
      }
    );
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
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In Cases
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action: PayloadAction<AuthPayload>) => {
        state.loading = false;
        state.token = action.payload.tokens.IdToken;
        state.user = action.payload.user;
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
      });
  },
});

export const { signOut } = authSlice.actions;
export default authSlice.reducer;