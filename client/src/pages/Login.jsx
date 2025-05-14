import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Link,
  Paper,
  Divider,
  IconButton,
  InputAdornment,
  CircularProgress,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { loginUser } from '../redux/slices/authSlice';
import { showErrorAlert } from '../redux/slices/alertSlice';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await dispatch(loginUser(values)).unwrap();
      dispatch(showErrorAlert('Login successful! Redirecting...'));
      navigate(from, { replace: true });
    } catch (error) {
      if (error.message) {
        setFieldError('email', error.message);
        setFieldError('password', error.message);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Log in to Raket Clone
        </Typography>
        
        <Box sx={{ mt: 4, mb: 4 }}>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            sx={{ mb: 2 }}
            disabled={loading}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            disabled={loading}
          >
            Continue with Facebook
          </Button>
        </Box>

        <Divider sx={{ my: 3 }}>or</Divider>

        <Formik
          initialValues={{
            email: '',
            password: '',
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form>
              <Field
                as={TextField}
                name="email"
                label="Email"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
                disabled={loading || isSubmitting}
              />
              <Field
                as={TextField}
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
                disabled={loading || isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ textAlign: 'right', mt: 1, mb: 3 }}>
                <Link
                  component={RouterLink}
                  to="/forgot-password"
                  variant="body2"
                  color="primary"
                >
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading || isSubmitting}
                sx={{ mt: 2, mb: 2 }}
              >
                {loading || isSubmitting ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Log In'
                )}
              </Button>
            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Don't have an account?{' '}
            <Link
              component={RouterLink}
              to="/register"
              state={{ from: location.state?.from }}
              color="primary"
            >
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;
