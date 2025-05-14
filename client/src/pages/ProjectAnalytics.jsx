import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Button,
  Tabs,
  Tab,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  People as PeopleIcon,
  AttachMoney as AttachMoneyIcon,
  Share as ShareIcon,
  FileDownload as FileDownloadIcon,
  DateRange as DateRangeIcon,
  Refresh as RefreshIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { format, subDays, formatDistanceToNow } from 'date-fns';
import { fetchProjectAnalytics } from '../redux/slices/analyticsSlice';
import { showErrorAlert } from '../redux/slices/alertSlice';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ProjectAnalytics = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const { project, loading, error } = useSelector((state) => state.analytics);
  const [tabValue, setTabValue] = useState(0);
  const [timeRange, setTimeRange] = useState('7days');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  // Mock data - replace with actual data from your API
  const mockBackers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', amount: 100, date: subDays(new Date(), 2), reward: 'Early Bird' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', amount: 50, date: subDays(new Date(), 3), reward: 'Standard' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', amount: 200, date: subDays(new Date(), 5), reward: 'Premium' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', amount: 75, date: subDays(new Date(), 1), reward: 'Standard' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', amount: 150, date: subDays(new Date(), 4), reward: 'Early Bird' },
  ];
  
  const mockReferralSources = [
    { name: 'Direct', value: 35 },
    { name: 'Social Media', value: 25 },
    { name: 'Email', value: 20 },
    { name: 'Search Engines', value: 15 },
    { name: 'Others', value: 5 },
  ];
  
  const mockDailyData = Array.from({ length: 14 }, (_, i) => ({
    date: format(subDays(new Date(), 13 - i), 'MMM d'),
    visitors: Math.floor(Math.random() * 500) + 100,
    backers: Math.floor(Math.random() * 20) + 5,
    amount: Math.floor(Math.random() * 5000) + 1000,
  }));
  
  useEffect(() => {
    if (projectId) {
      // In a real app, you would dispatch an action to fetch the project analytics
      // dispatch(fetchProjectAnalytics(projectId));
      
      // For now, we'll use mock data
      console.log(`Fetching analytics for project ${projectId}`);
    }
  }, [dispatch, projectId]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleTimeRangeChange = (newRange) => {
    setTimeRange(newRange);
    // In a real app, you would refetch data based on the new time range
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  
  const handleExportData = () => {
    // In a real app, this would trigger a download of the analytics data
    alert('Exporting data...');
  };
  
  const handleRefresh = () => {
    // In a real app, this would refetch the data
    console.log('Refreshing data...');
  };
  
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography color="error" gutterBottom>
          Error loading analytics: {error}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          sx={{ mt: 2 }}
        >
          Go Back
        </Button>
      </Container>
    );
  }
  
  // Mock project data - replace with actual data from your API
  const mockProject = {
    title: 'Amazing Project',
    fundingGoal: 10000,
    amountRaised: 6750,
    backersCount: 124,
    daysLeft: 15,
    fundingProgress: 67.5,
    launchDate: subDays(new Date(), 15),
    endDate: addDays(new Date(), 15),
  };
  
  const stats = [
    {
      title: 'Total Raised',
      value: `$${mockProject.amountRaised.toLocaleString()}`,
      change: '+12.5%',
      changePositive: true,
      icon: <AttachMoneyIcon color="primary" />,
    },
    {
      title: 'Total Backers',
      value: mockProject.backersCount,
      change: '+8.2%',
      changePositive: true,
      icon: <PeopleIcon color="secondary" />,
    },
    {
      title: 'Avg. Contribution',
      value: `$${Math.round(mockProject.amountRaised / mockProject.backersCount)}`,
      change: '+3.7%',
      changePositive: true,
      icon: <AttachMoneyIcon color="success" />,
    },
    {
      title: 'Days Left',
      value: mockProject.daysLeft,
      change: null,
      icon: <DateRangeIcon color="info" />,
    },
  ];
  
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Project Analytics: {mockProject.title}
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportData}
            sx={{ mr: 1 }}
          >
            Export Data
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {stat.title}
                  </Typography>
                  <Box display="flex" alignItems="flex-end">
                    <Typography variant="h4" component="div" sx={{ mr: 1 }}>
                      {stat.value}
                    </Typography>
                    {stat.change && (
                      <Typography
                        variant="body2"
                        color={stat.changePositive ? 'success.main' : 'error.main'}
                        sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}
                      >
                        {stat.change}
                      </Typography>
                    )}
                  </Box>
                </Box>
                <Box
                  sx={{
                    backgroundColor: 'primary.light',
                    borderRadius: '50%',
                    width: 48,
                    height: 48,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'primary.contrastText',
                  }}
                >
                  {stat.icon}
                </Box>
              </Box>
              {stat.progress !== undefined && (
                <Box sx={{ mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={stat.progress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Box display="flex" justifyContent="space-between" mt={1}>
                    <Typography variant="caption" color="text.secondary">
                      ${mockProject.amountRaised.toLocaleString()} raised
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {mockProject.fundingProgress}% of ${mockProject.fundingGoal.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Paper>
          </Grid>
        ))}
      </Grid>
      
      {/* Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab label="Overview" icon={<BarChartIcon />} iconPosition="start" />
          <Tab label="Backers" icon={<PeopleIcon />} iconPosition="start" />
          <Tab label="Traffic Sources" icon={<TimelineIcon />} iconPosition="start" />
          <Tab label="Referrals" icon={<ShareIcon />} iconPosition="start" />
        </Tabs>
        
        {/* Tab Content */}
        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" component="h2">
                  Funding Progress
                </Typography>
                <Box>
                  {['7days', '14days', '30days', 'all'].map((range) => (
                    <Button
                      key={range}
                      size="small"
                      color={timeRange === range ? 'primary' : 'inherit'}
                      variant={timeRange === range ? 'contained' : 'text'}
                      onClick={() => handleTimeRangeChange(range)}
                      sx={{ ml: 1, minWidth: 'auto' }}
                    >
                      {range === '7days' ? '7D' : range === '14days' ? '14D' : range === '30days' ? '30D' : 'All'}
                    </Button>
                  ))}
                </Box>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Total Raised Over Time
                    </Typography>
                    <Box sx={{ height: 300, mt: 2 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={mockDailyData}
                          margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                          }}
                        >
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <RechartsTooltip />
                          <Legend />
                          <Line
                            type="monotone"
                            dataKey="amount"
                            name="Amount Raised ($)"
                            stroke="#8884d8"
                            activeDot={{ r: 8 }}
                            strokeWidth={2}
                          />
                          <Line
                            type="monotone"
                            dataKey="backers"
                            name="New Backers"
                            stroke="#82ca9d"
                            strokeWidth={2}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Funding Progress
                    </Typography>
                    <Box sx={{ height: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                      <Box sx={{ width: '100%', maxWidth: 300, mx: 'auto' }}>
                        <ResponsiveContainer width="100%" height={200}>
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'Raised', value: mockProject.amountRaised },
                                { name: 'Remaining', value: mockProject.fundingGoal - mockProject.amountRaised },
                              ]}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              <Cell fill="#4CAF50" />
                              <Cell fill="#E0E0E0" />
                            </Pie>
                            <RechartsTooltip
                              formatter={(value) => [`$${value.toLocaleString()}`, '']}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <Box textAlign="center" mt={-4}>
                          <Typography variant="h5" component="div">
                            {mockProject.fundingProgress}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            of ${mockProject.fundingGoal.toLocaleString()} goal
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                </Grid>
                
                <Grid item xs={12}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Daily Performance
                    </Typography>
                    <Box sx={{ height: 300, mt: 2 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockDailyData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                          <XAxis dataKey="date" />
                          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                          <RechartsTooltip />
                          <Legend />
                          <Bar yAxisId="left" dataKey="visitors" name="Visitors" fill="#8884d8" />
                          <Bar yAxisId="right" dataKey="backers" name="Backers" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {tabValue === 1 && (
            <Box>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" component="h2">
                  Backer List
                </Typography>
                <Box>
                  <Tooltip title="Export backer list">
                    <IconButton onClick={handleExportData}>
                      <FileDownloadIcon />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Box>
              
              <Paper variant="outlined">
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell align="right">Amount</TableCell>
                        <TableCell>Reward</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {mockBackers
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((backer) => (
                          <TableRow key={backer.id}>
                            <TableCell>{backer.name}</TableCell>
                            <TableCell>{backer.email}</TableCell>
                            <TableCell align="right">${backer.amount.toLocaleString()}</TableCell>
                            <TableCell>{backer.reward}</TableCell>
                            <TableCell>
                              {format(backer.date, 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <Button size="small">View</Button>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={mockBackers.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                />
              </Paper>
              
              <Grid container spacing={3} sx={{ mt: 2 }}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Top Backers
                    </Typography>
                    <Box sx={{ height: 300, mt: 2 }}>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell>Name</TableCell>
                              <TableCell align="right">Amount</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {[...mockBackers]
                              .sort((a, b) => b.amount - a.amount)
                              .slice(0, 5)
                              .map((backer, index) => (
                                <TableRow key={index}>
                                  <TableCell>{backer.name}</TableCell>
                                  <TableCell align="right">${backer.amount.toLocaleString()}</TableCell>
                                </TableRow>
                              ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Backer Distribution by Reward
                    </Typography>
                    <Box sx={{ height: 300, mt: 2 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Early Bird', value: 45 },
                              { name: 'Standard', value: 35 },
                              { name: 'Premium', value: 20 },
                            ]}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {[0, 1, 2].map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <RechartsTooltip
                            formatter={(value, name) => [`${value} backers`, name]}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </Box>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
          
          {tabValue === 2 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Traffic Sources
                    <Tooltip title="Where your visitors are coming from">
                      <InfoIcon fontSize="small" sx={{ ml: 1, verticalAlign: 'middle', opacity: 0.5 }} />
                    </Tooltip>
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockReferralSources}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {mockReferralSources.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <RechartsTooltip
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: '100%' }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Traffic Over Time
                  </Typography>
                  <Box sx={{ height: 300, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockDailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <RechartsTooltip />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="visitors"
                          name="Visitors"
                          stroke="#8884d8"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Top Referrers
                  </Typography>
                  <TableContainer>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Source</TableCell>
                          <TableCell>Visitors</TableCell>
                          <TableCell>Backers</TableCell>
                          <TableCell>Conversion</TableCell>
                          <TableCell>Amount Raised</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {[
                          { source: 'facebook.com', visitors: 1250, backers: 45, amount: 3250 },
                          { source: 'twitter.com', visitors: 890, backers: 32, amount: 2450 },
                          { source: 'instagram.com', visitors: 760, backers: 28, amount: 1980 },
                          { source: 'google.com', visitors: 620, backers: 18, amount: 1250 },
                          { source: 'Direct', visitors: 540, backers: 12, amount: 980 },
                        ].map((row, index) => (
                          <TableRow key={index}>
                            <TableCell>{row.source}</TableCell>
                            <TableCell>{row.visitors.toLocaleString()}</TableCell>
                            <TableCell>{row.backers.toLocaleString()}</TableCell>
                            <TableCell>{((row.backers / row.visitors) * 100).toFixed(1)}%</TableCell>
                            <TableCell>${row.amount.toLocaleString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              </Grid>
            </Grid>
          )}
          
          {tabValue === 3 && (
            <Box>
              <Typography variant="h6" component="h2" gutterBottom>
                Referral Program
              </Typography>
              <Typography variant="body1" paragraph>
                Share your project with your network and track who's helping you spread the word.
              </Typography>
              
              <Paper sx={{ p: 3, mb: 4, bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                <Typography variant="h6" gutterBottom>
                  Your Referral Link
                </Typography>
                <Box display="flex" alignItems="center" mb={2}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    value={`${window.location.origin}/projects/${projectId}?ref=${user?.id || 'yourid'}`}
                    InputProps={{
                      readOnly: true,
                      style: { color: 'white', backgroundColor: 'rgba(255, 255, 255, 0.1)' },
                    }}
                  />
                  <Button
                    variant="contained"
                    color="secondary"
                    sx={{ ml: 1, minWidth: 100 }}
                    onClick={() => {
                      navigator.clipboard.writeText(
                        `${window.location.origin}/projects/${projectId}?ref=${user?.id || 'yourid'}`
                      );
                      // Show success message
                    }}
                  >
                    Copy
                  </Button>
                </Box>
                <Box display="flex" gap={2} flexWrap="wrap">
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<FacebookIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Share on Facebook
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<TwitterIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Share on Twitter
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<EmailIcon />}
                    sx={{ textTransform: 'none' }}
                  >
                    Share via Email
                  </Button>
                </Box>
              </Paper>
              
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Referral Performance
                    </Typography>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                      <Grid item xs={6}>
                        <Typography variant="h4" component="div">
                          24
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Referrals
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" component="div">
                          8
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Converted Backers
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" component="div">
                          $1,250
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Amount Raised
                        </Typography>
                      </Grid>
                      <Grid item xs={6}>
                        <Typography variant="h4" component="div">
                          33.3%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Conversion Rate
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper sx={{ p: 2, height: '100%' }}>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Top Referrers
                    </Typography>
                    <TableContainer>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Referrals</TableCell>
                            <TableCell align="right">Converted</TableCell>
                            <TableCell align="right">Amount</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {[
                            { name: 'John D.', referrals: 5, converted: 3, amount: 450 },
                            { name: 'Sarah M.', referrals: 4, converted: 2, amount: 300 },
                            { name: 'Alex T.', referrals: 3, converted: 1, amount: 200 },
                            { name: 'Emma R.', referrals: 2, converted: 1, amount: 150 },
                            { name: 'Mike P.', referrals: 1, converted: 1, amount: 150 },
                          ].map((row, index) => (
                            <TableRow key={index}>
                              <TableCell>{row.name}</TableCell>
                              <TableCell align="right">{row.referrals}</TableCell>
                              <TableCell align="right">{row.converted}</TableCell>
                              <TableCell align="right">${row.amount}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                </Grid>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default ProjectAnalytics;
