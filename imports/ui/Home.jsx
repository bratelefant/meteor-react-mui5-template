/**
 * Home page
 *
 * @locus Client
 * @module imports/ui/Home
 */
import React, { useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Welcome from './Welcome';
import { useCurrentUser } from './UserProvider';

/**
 * @function Home
 * @description React component that provides the home page. Not much going on here.
 * Customise to your needs.
 * @returns {JSX.Element} - Home
 */
function Home() {
  const navigate = useNavigate();
  const user = useCurrentUser();

  useEffect(() => {
    if (!user?._id) navigate('/login');
  }, [user?._id]);

  return (
    <Box sx={{ flexGrow: 1 }} id="home">
      <Container>
        <Box sx={{ my: 2 }}>
          <Welcome />
        </Box>
      </Container>
    </Box>
  );
}

export default Home;
