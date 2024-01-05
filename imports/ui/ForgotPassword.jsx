import React, { useState } from 'react';
import {
  TextField,
  Button,
  Stack,
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Typography,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['ForgotPassword']);

  const steps = [t('enter your email'), t('check your inbox')];

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    Accounts.forgotPassword({ email }, (err) => {
      if (err) {
        setError(err.reason);
      } else {
        setError(undefined);
        setActiveStep(1);
      }
    });
  };

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
                    <form onSubmit={onSubmit}>
                      <Stack spacing={1}>
                        <TextField
                          autoFocus
                          label={t('email')}
                          error={!!error}
                          helperText={error}
                          variant="outlined"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        <Button variant="contained" type="submit">
                          {t('reset password')}
                        </Button>
                      </Stack>
                    </form>
                  )}
                  {index === 1 && (
                    <Stack spacing={1}>
                      <Typography variant="h4" color="textSecondary">
                        {t('check your inbox')}
                      </Typography>
                      <Typography variant="body1">
                        {t('check the email we sent you and follow the link')}
                      </Typography>
                    </Stack>
                  )}
                </Box>
              </StepContent>
            </Step>
          ))}
        </Stepper>
      </Box>
    </Container>
  );
}

export default ForgotPassword;
