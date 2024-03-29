/**
 * Login component.
 *
 * @locus Client
 * @module imports/ui/Login
 */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Box, Container, TextField, Button, Stack,
} from '@mui/material';
import Welcome from './Welcome';
import ChooseLanguage from './ChooseLanguage';
import Loading from './Loading';

/**
 * @function Login
 * @description React component that provides a form to login a user. This also includes
 * a link to the sign up form and a link to the forgotten password form.
 * @returns {ReactNode} - The component displayed.
 */
function Login() {
  const { t } = useTranslation(['translation', 'Login']);
  const navigate = useNavigate();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState({});
  const onSubmit = (e) => {
    e.preventDefault();
    Meteor.loginWithPassword({ email }, password, (err) => {
      if (err) {
        setError({ password: t(err.reason, { ns: 'Login' }) });
      } else {
        setError({});
        navigate('/');
      }
    });
  };

  return (
    <>
      <Loading open={Meteor.loggingIn()} />
      <Container maxWidth="sm">
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          height="100vh"
        >
          <form onSubmit={onSubmit}>
            <Stack spacing={1} maxWidth={350}>
              <Welcome />

              <TextField
                label={t('email')}
                error={!!error}
                name="email"
                autoComplete="username"
                variant="outlined"
                margin="normal"
                helperText={error?.email}
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <TextField
                label={t('password')}
                autoComplete="current-password"
                error={!!error}
                name="password"
                variant="outlined"
                required
                margin="normal"
                type="password"
                value={password}
                helperText={error?.password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                {t('signin', { ns: 'Login' })}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate('/sign-up')}
              >
                {t('signup', { ns: 'Login' })}
              </Button>
              <Button
                variant="text"
                size="small"
                onClick={() => navigate('/forgotten-password')}
              >
                {t('forgottenPassword', { ns: 'Login' })}
              </Button>
            </Stack>
          </form>
        </Box>
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <ChooseLanguage variant="select" />
        </Box>
      </Container>
    </>
  );
}

export default Login;
