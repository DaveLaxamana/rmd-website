import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import {
  Search as SearchIcon,
  FilterList as FilterListIcon,
  Sort as SortIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Favorite as FavoriteIcon,
  BookmarkBorder as BookmarkBorderIcon,
  Bookmark as BookmarkIcon,
} from '@mui/icons-material';
import { fetchProjects } from '../redux/slices/projectSlice';
import { showErrorAlert } from '../redux/slices/alertSlice';

const Projects = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get filter and sort parameters from URL
  const category = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';
  const status = searchParams.get('status') || 'all';
  const sort = searchParams.get('sort') || 'popular';
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  const { projects, loading, error, totalPages, count } = useSelector((state) => state.project);
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [localCategory, setLocalCategory] = useState(category);
  const [localStatus, setLocalStatus] = useState(status);
  const [localSort, setLocalSort] = useState(sort);
  const [localPage, setLocalPage] = useState(page);
  const [tabValue, setTabValue] = useState(status === 'all' ? 0 : status === 'funding' ? 1 : 2);

  // Fetch projects when filters change
  useEffect(() => {
    const params = {
      page,
      limit: 12,
      ...(category && { category }),
      ...(searchQuery && { search: searchQuery }),
      ...(status !== 'all' && { status }),
      sort,
    };
    
    dispatch(fetchProjects(params));
  }, [dispatch, category, searchQuery, status, sort, page]);

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (localSearchQuery) params.set('q', localSearchQuery);
    if (localCategory) params.set('category', localCategory);
    if (localStatus !== 'all') params.set('status', localStatus);
    if (localSort !== 'popular') params.set('sort', localSort);
    if (localPage > 1) params.set('page', localPage);
    
    // Use replace to avoid adding to browser history for every filter change
    navigate(`?${params.toString()}`, { replace: true });
  }, [localSearchQuery, localCategory, localStatus, localSort, localPage, navigate]);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const statusMap = { 0: 'all', 1: 'funding', 2: 'successful' };
    setLocalStatus(statusMap[newValue]);
    setLocalPage(1);
  };

  // Handle search form submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setLocalSearchQuery(e.target.search.value);
    setLocalPage(1);
  };

  // Handle filter changes
  const handleCategoryChange = (e) => {
    setLocalCategory(e.target.value);
    setLocalPage(1);
  };

  const handleSortChange = (e) => {
    setLocalSort(e.target.value);
  };

  const handlePageChange = (event, value) => {
    setLocalPage(value);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Show error alert if there's an error
  useEffect(() => {
    if (error) {
      dispatch(showErrorAlert(error));
    }
  }, [error, dispatch]);

  // Categories for filtering
  const categories = [
    'All Categories',
    'Technology',
    'Art',
    'Design',
    'Film',
    'Games',
    'Music',
    'Publishing',
    'Food',
    'Fashion',
    'Theater',
    'Photography',
  ];

  // Sort options
  const sortOptions = [
    { value: 'popular', label: 'Most Popular' },
    { value: 'newest', label: 'Newest' },
    { value: 'ending', label: 'Ending Soon' },
    { value: 'most_funded', label: 'Most Funded' },
    { value: 'most_backed', label: 'Most Backed' },
  ];

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          borderRadius: 2,
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom>
            Discover Projects
          </Typography>
          <Typography variant="h6" component="p" paragraph>
            Find projects you love and help bring them to life.
          </Typography>
          
          {/* Search Form */}
          <Box component="form" onSubmit={handleSearchSubmit} sx={{ mt: 4, maxWidth: 600, mx: 'auto' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search projects..."
              name="search"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              InputProps={{
                sx: { bgcolor: 'background.paper' },
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </Container>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Sidebar Filters */}
        <Grid item xs={12} md={3}>
          <Box sx={{ position: 'sticky', top: 20 }}>
            {/* Category Filter */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Category
              </Typography>
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <Select
                  value={localCategory || 'all'}
                  onChange={handleCategoryChange}
                  displayEmpty
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat === 'All Categories' ? '' : cat}>
                      {cat}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>

            {/* Status Filter */}
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Status
              </Typography>
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                orientation="vertical"
                sx={{ borderRight: 1, borderColor: 'divider' }}
              >
                <Tab label="All" sx={{ textTransform: 'none', alignItems: 'flex-start' }} />
                <Tab label="Funding" sx={{ textTransform: 'none', alignItems: 'flex-start' }} />
                <Tab label="Successful" sx={{ textTransform: 'none', alignItems: 'flex-start' }} />
              </Tabs>
            </Paper>

            {/* Sort Options */}
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Sort By
              </Typography>
              <FormControl fullWidth size="small">
                <Select
                  value={localSort}
                  onChange={handleSortChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon />
                    </InputAdornment>
                  }
                >
                  {sortOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Paper>
          </Box>
        </Grid>

        {/* Projects Grid */}
        <Grid item xs={12} md={9}>
          {/* Results Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" component="h2">
              {category || 'All Projects'}
              {searchQuery && `: "${searchQuery}"`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Showing {projects.length} of {count} projects
            </Typography>
          </Box>

          {/* Loading State */}
          {loading && (
            <Box display="flex" justifyContent="center" my={8}>
              <CircularProgress />
            </Box>
          )}

          {/* No Results */}
          {!loading && projects.length === 0 && (
            <Box textAlign="center" my={8}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No projects found
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
            </Box>
          )}

          {/* Projects Grid */}
          <Grid container spacing={3}>
            {projects.map((project) => (
              <Grid item key={project._id} xs={12} sm={6} lg={4}>
                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <CardActionArea component={RouterLink} to={`/projects/${project._id}`}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={project.images?.[0] || '/placeholder-project.jpg'}
                      alt={project.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="h3" noWrap>
                        {project.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}>
                        {project.description}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box sx={{ width: '100%', mr: 1 }}>
                          <LinearProgress
                            variant="determinate"
                            value={Math.min(
                              Math.round((project.amountRaised / project.fundingGoal) * 100),
                              100
                            )}
                            sx={{ height: 6, borderRadius: 3 }}
                          />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {Math.min(
                            Math.round((project.amountRaised / project.fundingGoal) * 100),
                            100
                          )}%
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          ${project.amountRaised?.toLocaleString()}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${project.fundingGoal?.toLocaleString()} goal
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                          {project.backers?.length || 0} backers
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Math.ceil(
                            (new Date(project.endDate) - new Date()) / (1000 * 60 * 60 * 24)
                          )}{' '}
                          days to go
                        </Typography>
                      </Box>
                    </CardContent>
                  </CardActionArea>
                  <CardActions sx={{ p: 2, pt: 0, justifyContent: 'space-between' }}>
                    <Box>
                      <IconButton size="small" aria-label="add to favorites">
                        <FavoriteBorderIcon />
                      </IconButton>
                      <IconButton size="small" aria-label="bookmark">
                        <BookmarkBorderIcon />
                      </IconButton>
                    </Box>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={totalPages}
                page={localPage}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
              />
            </Box>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Projects;
