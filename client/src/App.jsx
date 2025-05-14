import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/slices/authSlice';
import theme from './theme';
import Alert from './components/common/Alert';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateProject from './pages/CreateProject';
import ProjectDetails from './pages/ProjectDetails';
import EditProject from './pages/EditProject';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './components/routing/PrivateRoute';

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <Alert />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />}
              />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />}
              />
              <Route
                path="/dashboard"
                element={
                  <PrivateRoute>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="/projects/new"
                element={
                  <PrivateRoute>
                    <CreateProject />
                  </PrivateRoute>
                }
              />
              <Route path="/projects/:id" element={<ProjectDetails />} />
              <Route
                path="/projects/:id/edit"
                element={
                  <PrivateRoute>
                    <EditProject />
                  </PrivateRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <PrivateRoute>
                    <UserProfile />
                  </PrivateRoute>
                }
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
