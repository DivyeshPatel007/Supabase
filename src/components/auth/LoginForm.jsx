import React, { useState } from 'react';
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Box,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert,
  CircularProgress,
  Link as MuiLink,
  Divider
} from '@mui/material';
import { Visibility, VisibilityOff, Google } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUserRole, signIn, supabaseClient } from '../../services/auth';
import { useAuth } from '../../contexts/AuthProvider';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUserRole } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setNeedsConfirmation(false);

    try {
      const { data, error } = await signIn(formData.email, formData.password);

      if (error) {
        console.error("Login error:", error);

        if (error.message === "Invalid login credentials") {

          const { data: userData } = await supabaseClient.auth.admin.listUsers();
          const userExists = userData?.users?.some(user =>
            user.email === formData.email && !user.email_confirmed_at
          );

          if (userExists) {
            setNeedsConfirmation(true);
            setAlert({
              open: true,
              message: "Please confirm your email before logging in.",
              severity: "warning"
            });
          } else {
            setAlert({
              open: true,
              message: "Invalid email or password. Please try again.",
              severity: "error"
            });
          }
        } else {
          setAlert({
            open: true,
            message: error.message,
            severity: "error"
          });
        }
      } else if (data.user) {
        const role = await fetchUserRole(data.user.id);
        setUserRole(role);

        setAlert({
          open: true,
          message: "Login successful!",
          severity: "success"
        });

        navigate('/');
      }
    } catch (err) {
      console.error(err);
      setAlert({
        open: true,
        message: "An unexpected error occurred",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle Google social login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const { data, error } = await supabaseClient.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      });

      if (error) {
        console.error("Google login error:", error);
        setAlert({
          open: true,
          message: error.message,
          severity: "error"
        });
      } else {
        // Note: Most of the login flow will continue after redirect
        // The code to handle setting the role will be in the callback
        console.log("Redirecting to Google for authentication...");
      }
    } catch (err) {
      console.error(err);
      setAlert({
        open: true,
        message: "Failed to initialize Google login",
        severity: "error"
      });
      setGoogleLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    setLoading(true);
    try {
      const { error } = await supabaseClient.auth.resend({
        type: 'signup',
        email: formData.email,
      });

      if (error) {
        setAlert({
          open: true,
          message: error.message,
          severity: "error"
        });
      } else {
        setAlert({
          open: true,
          message: "Confirmation email sent! Please check your inbox.",
          severity: "success"
        });
      }
    } catch (err) {
      console.error(err);
      setAlert({
        open: true,
        message: "Failed to resend confirmation email",
        severity: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setAlert(prev => ({
      ...prev,
      open: false
    }));
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: 2
      }}
    >
      <Card sx={{ maxWidth: 400, width: '100%', boxShadow: 3 }}>
        <CardContent sx={{ padding: 3 }}>
          <Typography variant="h5" component="h1" align="center" gutterBottom>
            Log In
          </Typography>

          {/* Google Login Button */}
          <Button
            fullWidth
            variant="outlined"
            startIcon={<Google />}
            onClick={handleGoogleLogin}
            disabled={googleLoading || loading}
            sx={{ mt: 2, mb: 2, py: 1.5 }}
          >
            {googleLoading ? <CircularProgress size={24} /> : 'Sign in with Google'}
          </Button>

          <Divider sx={{ my: 2 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Log In'}
            </Button>

            {needsConfirmation && (
              <Box sx={{ textAlign: 'center', mt: 1, mb: 2 }}>
                <Typography variant="body2" color="text.secondary">
                  Need to confirm your email?{' '}
                  <MuiLink
                    component="button"
                    variant="body2"
                    onClick={handleResendConfirmation}
                    sx={{ textDecoration: 'none', cursor: 'pointer' }}
                  >
                    Resend confirmation email
                  </MuiLink>
                </Typography>
              </Box>
            )}

            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Typography variant="body2">
                Don't have an account?{' '}
                <Link to="/register" style={{ textDecoration: 'none' }}>
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={alert.open}
        autoHideDuration={6000}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseAlert}
          severity={alert.severity}
          sx={{ width: '100%' }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LoginForm;