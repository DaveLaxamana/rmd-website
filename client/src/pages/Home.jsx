import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink } from 'react-router-dom';
import { Container, Grid, Typography, Button, Box, Card, CardContent, CardMedia, CardActions, Chip } from '@mui/material';
import { fetchProjects } from '../redux/slices/projectSlice';
import { showErrorAlert } from '../redux/slices/alertSlice';

const Home = () => {
  const dispatch = useDispatch();
  const { projects, loading, error } = useSelector((state) => state.project);
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(fetchProjects({ status: 'funding' }));
  }, [dispatch]);

  useEffect(() => {
    if (error) {
      dispatch(showErrorAlert(error));
    }
  }, [error, dispatch]);

  const featuredProjects = projects.slice(0, 3);
  const recentProjects = projects.slice(0, 6);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Bring creative projects to life
          </Typography>
          <Typography variant="h5" component="p" paragraph>
            Raket Clone is a funding platform for creative projects. Everything from films, games, and music to art,
            design, and technology.
          </Typography>
          <Box sx={{ mt: 4 }}>
            {isAuthenticated ? (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={RouterLink}
                to="/projects/new"
              >
                Start a Project
              </Button>
            ) : (
              <Button
                variant="contained"
                color="secondary"
                size="large"
                component={RouterLink}
                to="/register"
              >
                Sign Up to Start
              </Button>
            )}
          </Box>
        </Container>
      </Box>


      {/* Featured Projects */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h4" component="h2" gutterBottom align="center">
          Featured Projects
        </Typography>
        <Typography variant="subtitle1" color="textSecondary" paragraph align="center" sx={{ mb: 4 }}>
          Discover inspiring projects just for you and get great rewards when you back them.
        </Typography>
        
        <Grid container spacing={4}>
          {featuredProjects.map((project) => (
            <Grid item key={project._id} xs={12} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={project.images?.[0] || '/placeholder-project.jpg'}
                  alt={project.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Chip
                      label={project.category}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {project.location}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    component={RouterLink}
                    to={`/projects/${project._id}`}
                  >
                    View Project
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Categories */}
      <Box sx={{ bgcolor: 'grey.100', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h4" component="h2" gutterBottom align="center">
            Popular Categories
          </Typography>
          <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
            {[
              'Technology',
              'Art',
              'Design',
              'Film',
              'Games',
              'Music',
              'Publishing',
              'Food',
            ].map((category) => (
              <Grid item key={category}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to={`/projects?category=${category.toLowerCase()}`}
                >
                  {category}
                </Button>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>


      {/* Recent Projects */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">
            Recently Launched
          </Typography>
          <Button component={RouterLink} to="/projects" color="primary">
            View All Projects
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {recentProjects.map((project) => (
            <Grid item key={project._id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={project.images?.[0] || '/placeholder-project.jpg'}
                  alt={project.title}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {project.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {project.description.substring(0, 100)}...
                  </Typography>
                  <Box sx={{ mt: 'auto' }}>
                    <Chip
                      label={project.category}
                      size="small"
                      sx={{ mr: 1, mb: 1 }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      {project.location}
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    component={RouterLink}
                    to={`/projects/${project._id}`}
                  >
                    View Project
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action */}
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8, textAlign: 'center' }}>
        <Container maxWidth="md">
          <Typography variant="h4" component="h2" gutterBottom>
            Ready to bring your creative project to life?
          </Typography>
          <Typography variant="h6" component="p" paragraph>
            Join thousands of creators who have brought their ideas to life with Raket Clone.
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            size="large"
            component={RouterLink}
            to={isAuthenticated ? '/projects/new' : '/register'}
            sx={{ mt: 2 }}
          >
            Start Your Project
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
