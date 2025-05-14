import { useState } from 'react';
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
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { registerUser } from '../redux/slices/authSlice';
import { showSuccessAlert } from '../redux/slices/alertSlice';

const validationSchema = Yup.object({
  name: Yup.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .required('Name is required'),
  email: Yup.string()
    .email('Enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  terms: Yup.boolean()
    .oneOf([true], 'You must accept the terms and conditions')
    .required('You must accept the terms and conditions'),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const from = location.state?.from?.pathname || '/';

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleSubmit = async (values, { setSubmitting, setFieldError }) => {
    try {
      await dispatch(registerUser(values)).unwrap();
      dispatch(showSuccessAlert('Registration successful! Welcome to Raket Clone.'));
      navigate(from, { replace: true });
    } catch (error) {
      if (error.message) {
        if (error.message.includes('email')) {
          setFieldError('email', error.message);
        } else {
          setFieldError('form', error.message);
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Join Raket Clone
        </Typography>
        
        <Typography variant="body1" color="text.secondary" align="center" paragraph>
          Create an account to discover and back inspiring projects.
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
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
            terms: false,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, isSubmitting, values }) => (
            <Form>
              <Field
                as={TextField}
                name="name"
                label="Full Name"
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.name && Boolean(errors.name)}
                helperText={touched.name && errors.name}
                disabled={loading || isSubmitting}
              />
              <Field
                as={TextField}
                name="email"
                label="Email"
                type="email"
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
              <Field
                as={TextField}
                name="confirmPassword"
                label="Confirm Password"
                type={showConfirmPassword ? 'text' : 'password'}
                fullWidth
                margin="normal"
                variant="outlined"
                error={touched.confirmPassword && Boolean(errors.confirmPassword)}
                helperText={touched.confirmPassword && errors.confirmPassword}
                disabled={loading || isSubmitting}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle confirm password visibility"
                        onClick={handleClickShowConfirmPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                      >
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Box sx={{ mt: 2, mb: 3 }}>
                <Field
                  as={FormControlLabel}
                  name="terms"
                  control={
                    <Checkbox
                      checked={values.terms}
                      color="primary"
                      disabled={loading || isSubmitting}
                    />
                  }
                  label={
                    <Typography variant="body2">
                      I agree to the{' '}
                      <Link href="/terms" color="primary">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" color="primary">
                        Privacy Policy
                      </Link>
                    </Typography>
                  }
                />
                {touched.terms && errors.terms && (
                  <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                    {errors.terms}
                  </Typography>
                )}
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
                  'Create Account'
                )}
              </Button>
            </Form>
          )}
        </Formik>

        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              state={{ from: location.state?.from }}
              color="primary"
            >
              Log in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
