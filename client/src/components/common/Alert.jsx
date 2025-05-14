import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Alert as MuiAlert, Snackbar } from '@mui/material';
import { hideAlert } from '../../redux/slices/alertSlice';

const Alert = () => {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector((state) => state.alert);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideAlert());
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <MuiAlert 
        onClose={handleClose} 
        severity={severity} 
        elevation={6} 
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </MuiAlert>
    </Snackbar>
  );
};

export default Alert;
