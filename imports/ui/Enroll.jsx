import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import {
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { Accounts } from 'meteor/accounts-base';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Enroll() {
  const [password, setPassword] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['Enroll']);

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setActiveStep(1);
      setError(t('Passwords do not match'));
    } else {
      Accounts.resetPassword(token, password, (err) => {
        if (err) {
          setError(
            err.reason?.includes('Token expired')
              ? t('Token expired')
              : err.reason,
          );
        } else {
          setError(null);
          setActiveStep(2);
        }
      });
    }
  };

  const steps = [t('choose password'), t('confirm password'), t('done')];

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh"
      >
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Box sx={{ width: 300 }}>
                  {index === 0 && (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        setActiveStep(1);
                      }}
                    >
                      <Stack spacing={1}>
                        <TextField
                          autoFocus
                          sx={{ m: 1 }}
                          label={t('password', { ns: 'Enroll' })}
                          type="password"
                          autoComplete="new-password"
                          value={password}
                          onChange={handlePasswordChange}
                        />
                        <Button variant="contained" type="submit">
                          {t('continue')}
                        </Button>
                      </Stack>
                    </form>
                  )}
                  {index === 1 && (
                    <form onSubmit={onSubmit}>
                      <Stack spacing={1}>
                        <TextField
                          autoFocus
                          autoComplete="new-password"
                          error={!!error}
                          helperText={error}
                          aria-errormessage="Passwörter stimmen nicht überein"
                          sx={{ m: 1 }}
                          label={t('confirm password')}
                          type="password"
                          value={confirmPassword}
                          onChange={handleConfirmPasswordChange}
                        />
                        <Button
                          sx={{ m: 1 }}
                          variant="contained"
                          color="primary"
                          type="submit"
                        >
                          {t('continue')}
                        </Button>
                        <Button
                          disabled={index !== 1}
                          onClick={() => setActiveStep(0)}
                          sx={{ mt: 1, mr: 1 }}
                        >
                          {t('back')}
                        </Button>
                      </Stack>
                    </form>
                  )}
                  {index === 2 && (
                    <Stack spacing={1}>
                      <Typography variant="h4" color="textSecondary">
                        {t('Registration successful')}
                      </Typography>
                      <Typography variant="body1">
                        {t('You can now log in with your new password.')}
                      </Typography>
                      <Button variant="contained" onClick={() => navigate('/')}>
                        {t('start')}
                      </Button>
                    </Stack>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        <Stack spacing={1} />
      </Box>
    </Container>
  );
}

export default Enroll;
