import { Box, Container, Typography, Link as MuiLink, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="body1" color="text.secondary">
            © {new Date().getFullYear()} Raket Clone. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mt: { xs: 2, md: 0 } }}>
            <MuiLink
              component={RouterLink}
              to="/about"
              color="text.secondary"
              underline="hover"
            >
              About
            </MuiLink>
            <MuiLink
              component={RouterLink}
              to="/terms"
              color="text.secondary"
              underline="hover"
            >
              Terms
            </MuiLink>
            <MuiLink
              component={RouterLink}
              to="/privacy"
              color="text.secondary"
              underline="hover"
            >
              Privacy
            </MuiLink>
            <MuiLink
              component={RouterLink}
              to="/contact"
              color="text.secondary"
              underline="hover"
            >
              Contact
            </MuiLink>
          </Box>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          Made with ❤️ for creators and backers around the world.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
