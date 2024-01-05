import React, { useEffect } from 'react';
import { Container, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Welcome from './Welcome';
import { useCurrentUser } from './UserProvider';

function Home() {
  const navigate = useNavigate();
  const user = useCurrentUser();

  useEffect(() => {
    if (!user?._id) navigate('/login');
  }, [user?._id]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Container>
        <Welcome />
      </Container>
    </Box>
  );
}

export default Home;
