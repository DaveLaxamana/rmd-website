import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Container, Typography, Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TablePagination, TableSortLabel,
  Button, IconButton, Chip, TextField, InputAdornment, Menu, MenuItem,
  ListItemIcon, ListItemText, Divider, Avatar, Card, CardContent, Grid,
  useTheme, useMediaQuery, Dialog, DialogTitle, DialogContent, DialogActions,
  DialogContentText, LinearProgress, Tooltip, Badge, CircularProgress
} from '@mui/material';
import {
  FilterList as FilterListIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Email as EmailIcon,
  Message as MessageIcon,
  Receipt as ReceiptIcon,
  LocalOffer as RewardIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  ArrowBack as ArrowBackIcon,
  Refresh as RefreshIcon,
  FileDownload as FileDownloadIcon,
  Person as PersonIcon,
  AttachMoney as AttachMoneyIcon,
  DateRange as DateRangeIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Star as StarIcon,
  HourglassEmpty as HourglassEmptyIcon,
  Send as SendIcon
} from '@mui/icons-material';
import { format } from 'date-fns';

// Mock data
const mockBackers = [
  {
    id: '1',
    user: { id: 'u1', name: 'John Doe', email: 'john@example.com', avatar: '' },
    amount: 100,
    reward: { id: '3', title: 'Premium' },
    status: 'confirmed',
    date: new Date('2023-06-15T10:30:00'),
    message: 'Excited to support your project!',
    isTopBacker: true,
  },
  {
    id: '2',
    user: { id: 'u2', name: 'Jane Smith', email: 'jane@example.com', avatar: '' },
    amount: 50,
    reward: { id: '2', title: 'Standard' },
    status: 'confirmed',
    date: new Date('2023-06-14T14:45:00'),
    message: 'Looking forward to the rewards!',
    isTopBacker: false,
  },
  {
    id: '3',
    user: { id: 'u3', name: 'Bob Johnson', email: 'bob@example.com', avatar: '' },
    amount: 25,
    reward: { id: '1', title: 'Early Bird' },
    status: 'pending',
    date: new Date('2023-06-14T09:15:00'),
    message: 'Hope this helps!',
    isTopBacker: false,
  },
  {
    id: '4',
    user: { id: 'u4', name: 'Alice Williams', email: 'alice@example.com', avatar: '' },
    amount: 250,
    reward: { id: '4', title: 'VIP' },
    status: 'confirmed',
    date: new Date('2023-06-13T16:20:00'),
    message: 'Amazing project!',
    isTopBacker: true,
  },
  {
    id: '5',
    user: { id: 'u5', name: 'Charlie Brown', email: 'charlie@example.com', avatar: '' },
    amount: 50,
    reward: { id: '2', title: 'Standard' },
    status: 'confirmed',
    date: new Date('2023-06-13T11:05:00'),
    message: '',
    isTopBacker: false,
  },
];

const mockRewards = [
  { id: '1', title: 'Early Bird', amount: 25 },
  { id: '2', title: 'Standard', amount: 50 },
  { id: '3', title: 'Premium', amount: 100 },
  { id: '4', title: 'VIP', amount: 250 },
];

const BackerManagement = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // State management
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState('desc');
  const [orderBy, setOrderBy] = useState('date');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [rewardFilter, setRewardFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedBacker, setSelectedBacker] = useState(null);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch backers on component mount
  useEffect(() => {
    const fetchBackers = async () => {
      setLoading(true);
      try {
        // In a real app, you would fetch backers from your API
        // const response = await fetch(`/api/projects/${projectId}/backers`);
        // const data = await response.json();
        // setBackers(data);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      } catch (err) {
        setError('Failed to load backers');
        console.error('Error fetching backers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBackers();
  }, [projectId]);

  // Handle table sorting
  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Handle search
  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(0);
  };

  // Handle reward filter change
  const handleRewardFilterChange = (rewardId) => {
    setRewardFilter(rewardId);
    setPage(0);
  };

  // Open backer menu
  const handleMenuOpen = (event, backer) => {
    setSelectedBacker(backer);
    setAnchorEl(event.currentTarget);
  };

  // Close backer menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Open message dialog
  const handleOpenMessageDialog = () => {
    setMessageDialogOpen(true);
    handleMenuClose();
  };

  // Close message dialog
  const handleCloseMessageDialog = () => {
    setMessageDialogOpen(false);
    setMessageText('');
  };

  // Handle sending message to backer
  const handleSendMessage = async () => {
    if (!messageText.trim() || !selectedBacker) return;
    
    setSendingMessage(true);
    try {
      // In a real app, you would send the message via API
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Message to ${selectedBacker.user.name}:`, messageText);
      handleCloseMessageDialog();
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSendingMessage(false);
    }
  };

  // Handle updating backer status
  const handleUpdateStatus = async (status) => {
    if (!selectedBacker) return;
    
    try {
      // In a real app, you would update the status via API
      await new Promise(resolve => setTimeout(resolve, 500));
      console.log(`Updated backer ${selectedBacker.user.name} status to:`, status);
      handleMenuClose();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  // Handle export backers
  const handleExportBackers = () => {
    // In a real app, this would trigger a download
    console.log('Exporting backers data...');
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status color
  const getStatusColor = (status) => {
    const colors = {
      confirmed: 'success',
      pending: 'warning',
      cancelled: 'error',
      refunded: 'default',
    };
    return colors[status] || 'default';
  };

  // Get status icon
  const getStatusIcon = (status) => {
    const icons = {
      confirmed: <CheckCircleIcon fontSize="small" />,
      pending: <HourglassEmptyIcon fontSize="small" />,
      cancelled: <CancelIcon fontSize="small" />,
      refunded: <RefreshIcon fontSize="small" />,
    };
    return icons[status] || null;
  };

  // Filter and sort backers
  const filteredBackers = mockBackers
    .filter(backer => {
      const matchesSearch = 
        backer.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        backer.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (backer.message && backer.message.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === 'all' || backer.status === statusFilter;
      const matchesReward = rewardFilter === 'all' || backer.reward.id === rewardFilter;
      
      return matchesSearch && matchesStatus && matchesReward;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (orderBy) {
        case 'name':
          comparison = a.user.name.localeCompare(b.user.name);
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'date':
          comparison = new Date(a.date) - new Date(b.date);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        default:
          comparison = 0;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });

  // Get paginated backers
  const paginatedBackers = filteredBackers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate status counts
  const statusCounts = mockBackers.reduce(
    (acc, backer) => {
      acc[backer.status] = (acc[backer.status] || 0) + 1;
      return acc;
    },
    { all: mockBackers.length }
  );

  // Calculate reward counts
  const rewardCounts = mockBackers.reduce(
    (acc, backer) => {
      acc[backer.reward.id] = (acc[backer.reward.id] || 0) + 1;
      return acc;
    },
    { all: mockBackers.length }
  );

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
          {error}
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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" alignItems="center">
          <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Backer Management
          </Typography>
        </Box>
        <Box>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            onClick={handleExportBackers}
            sx={{ mr: 1 }}
          >
            Export
          </Button>
          <Button
            variant="contained"
            startIcon={<RefreshIcon />}
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        </Box>
      </Box>
      
      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Backers
              </Typography>
              <Box display="flex" alignItems="center">
                <PersonIcon color="primary" sx={{ mr: 1, fontSize: 40, opacity: 0.8 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {mockBackers.length}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mockBackers.filter(b => b.status === 'confirmed').length} confirmed
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Total Raised
              </Typography>
              <Box display="flex" alignItems="center">
                <AttachMoneyIcon color="success" sx={{ mr: 1, fontSize: 40, opacity: 0.8 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {formatCurrency(mockBackers.reduce((sum, backer) => sum + backer.amount, 0))}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    from {mockRewards.length} reward tiers
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Avg. Contribution
              </Typography>
              <Box display="flex" alignItems="center">
                <AttachMoneyIcon color="secondary" sx={{ mr: 1, fontSize: 40, opacity: 0.8 }} />
                <Box>
                  <Typography variant="h4" component="div">
                    {formatCurrency(
                      mockBackers.length > 0
                        ? mockBackers.reduce((sum, backer) => sum + backer.amount, 0) / mockBackers.length
                        : 0
                    )}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    per backer
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                First Backer
              </Typography>
              <Box display="flex" alignItems="center">
                <DateRangeIcon color="info" sx={{ mr: 1, fontSize: 40, opacity: 0.8 }} />
                <Box>
                  <Typography variant="h6" component="div">
                    {mockBackers.length > 0
                      ? format(new Date(mockBackers[mockBackers.length - 1].date), 'MMM d, yyyy')
                      : 'N/A'}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {mockBackers.length > 0
                      ? `${Math.ceil((new Date() - new Date(mockBackers[mockBackers.length - 1].date)) / (1000 * 60 * 60 * 24))} days ago`
                      : 'No backers yet'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search backers..."
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          
          <Grid item xs={12} md={8}>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label={`All (${statusCounts.all})`}
                onClick={() => handleStatusFilterChange('all')}
                color={statusFilter === 'all' ? 'primary' : 'default'}
                variant={statusFilter === 'all' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<CheckCircleIcon fontSize="small" />}
                label={`Confirmed (${statusCounts.confirmed || 0})`}
                onClick={() => handleStatusFilterChange('confirmed')}
                color={statusFilter === 'confirmed' ? 'success' : 'default'}
                variant={statusFilter === 'confirmed' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<HourglassEmptyIcon fontSize="small" />}
                label={`Pending (${statusCounts.pending || 0})`}
                onClick={() => handleStatusFilterChange('pending')}
                color={statusFilter === 'pending' ? 'warning' : 'default'}
                variant={statusFilter === 'pending' ? 'filled' : 'outlined'}
              />
              <Chip
                icon={<CancelIcon fontSize="small" />}
                label={`Cancelled (${statusCounts.cancelled || 0})`}
                onClick={() => handleStatusFilterChange('cancelled')}
                color={statusFilter === 'cancelled' ? 'error' : 'default'}
                variant={statusFilter === 'cancelled' ? 'filled' : 'outlined'}
              />
            </Box>
          </Grid>
          
          <Grid item xs={12}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Filter by Reward:
            </Typography>
            <Box display="flex" flexWrap="wrap" gap={1}>
              <Chip
                label={`All Rewards (${rewardCounts.all})`}
                onClick={() => handleRewardFilterChange('all')}
                color={rewardFilter === 'all' ? 'primary' : 'default'}
                variant={rewardFilter === 'all' ? 'filled' : 'outlined'}
              />
              {mockRewards.map((reward) => (
                <Chip
                  key={reward.id}
                  icon={<RewardIcon fontSize="small" />}
                  label={`${reward.title} (${rewardCounts[reward.id] || 0})`}
                  onClick={() => handleRewardFilterChange(reward.id)}
                  color={rewardFilter === reward.id ? 'secondary' : 'default'}
                  variant={rewardFilter === reward.id ? 'filled' : 'outlined'}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Backers Table */}
      <Paper sx={{ width: '100%', mb: 2, overflow: 'hidden' }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="backers table" size={isMobile ? 'small' : 'medium'}>
            <TableHead>
              <TableRow>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'name'}
                    direction={orderBy === 'name' ? order : 'asc'}
                    onClick={() => handleRequestSort('name')}
                  >
                    Backer
                  </TableSortLabel>
                </TableCell>
                <TableCell align="right">
                  <TableSortLabel
                    active={orderBy === 'amount'}
                    direction={orderBy === 'amount' ? order : 'desc'}
                    onClick={() => handleRequestSort('amount')}
                  >
                    Amount
                  </TableSortLabel>
                </TableCell>
                <TableCell>Reward</TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'status'}
                    direction={orderBy === 'status' ? order : 'asc'}
                    onClick={() => handleRequestSort('status')}
                  >
                    Status
                  </TableSortLabel>
                </TableCell>
                <TableCell>
                  <TableSortLabel
                    active={orderBy === 'date'}
                    direction={orderBy === 'date' ? order : 'desc'}
                    onClick={() => handleRequestSort('date')}
                  >
                    Date
                  </TableSortLabel>
                </TableCell>
                <TableCell>Message</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedBackers.length > 0 ? (
                paginatedBackers.map((backer) => (
                  <TableRow
                    key={backer.id}
                    hover
                    sx={{
                      '&:nth-of-type(odd)': {
                        backgroundColor: 'action.hover',
                      },
                      '&:last-child td, &:last-child th': {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell component="th" scope="row">
                      <Box display="flex" alignItems="center">
                        <Avatar
                          src={backer.user.avatar}
                          alt={backer.user.name}
                          sx={{ width: 32, height: 32, mr: 1 }}
                        >
                          {backer.user.name.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" noWrap>
                            {backer.user.name}
                            {backer.isTopBacker && (
                              <Tooltip title="Top Backer">
                                <StarIcon
                                  fontSize="small"
                                  color="warning"
                                  sx={{ ml: 0.5, verticalAlign: 'middle' }}
                                />
                              </Tooltip>
                            )}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" noWrap>
                            {backer.user.email}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2" fontWeight="medium">
                        {formatCurrency(backer.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={backer.reward.title}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(backer.status)}
                        label={backer.status.charAt(0).toUpperCase() + backer.status.slice(1)}
                        color={getStatusColor(backer.status)}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {format(new Date(backer.date), 'MMM d, yyyy')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {format(new Date(backer.date), 'h:mm a')}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        noWrap
                        sx={{ maxWidth: 200 }}
                        title={backer.message}
                      >
                        {backer.message || 'No message'}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(e) => handleMenuOpen(e, backer)}
                      >
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Box sx={{ py: 2 }}>
                      <PersonIcon sx={{ fontSize: 48, opacity: 0.5, mb: 1 }} />
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        No backers found
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Try adjusting your search or filters
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredBackers.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      
      {/* Backer Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        onClick={handleMenuClose}
        PaperProps={{
          elevation: 3,
          sx: {
            width: 240,
            maxWidth: '100%',
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleOpenMessageDialog}>
          <ListItemIcon>
            <EmailIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Send Message</ListItemText>
        </MenuItem>
        <MenuItem>
          <ListItemIcon>
            <ReceiptIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Pledge Details</ListItemText>
        </MenuItem>
        <Divider />
        <Typography variant="caption" color="text.secondary" sx={{ px: 2, py: 1 }}>
          Update Status
        </Typography>
        <MenuItem onClick={() => handleUpdateStatus('confirmed')}>
          <ListItemIcon>
            <CheckCircleIcon fontSize="small" color="success" />
          </ListItemIcon>
          <ListItemText>Mark as Confirmed</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus('pending')}>
          <ListItemIcon>
            <HourglassEmptyIcon fontSize="small" color="warning" />
          </ListItemIcon>
          <ListItemText>Mark as Pending</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => handleUpdateStatus('cancelled')}>
          <ListItemIcon>
            <CancelIcon fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText>Mark as Cancelled</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View Backer Profile</ListItemText>
        </MenuItem>
      </Menu>
      
      {/* Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={handleCloseMessageDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Message to {selectedBacker?.user.name || 'Backer'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="message"
            label="Your Message"
            type="text"
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            disabled={sendingMessage}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseMessageDialog}
            disabled={sendingMessage}
            startIcon={<CloseIcon />}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSendMessage}
            disabled={!messageText.trim() || sendingMessage}
            variant="contained"
            startIcon={sendingMessage ? <CircularProgress size={20} /> : <SendIcon />}
          >
            {sendingMessage ? 'Sending...' : 'Send Message'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default BackerManagement;
