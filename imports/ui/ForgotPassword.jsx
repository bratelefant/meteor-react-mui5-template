/**
 * ForgotPassword component.
 *
 * @locus Client
 * @module imports/ui/ForgotPassword
 */
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

/**
 * @function ForgotPassword
 * @description React component that provides a simple stepper to reset the password.
 * @returns {JSX.Element} - ForgotPassword
 */
function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const { t } = useTranslation(['bratelefant_mrm-locales']);

  const steps = [t('ForgotPassword.step.enterYourEmail'), t('ForgotPassword.step.checkYourInbox')];

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
                          label={t('ForgotPassword.email')}
                          error={!!error}
                          helperText={error}
                          variant="outlined"
                          placeholder={t('ForgotPassword.email')}
                          value={email}
                          onChange={handleEmailChange}
                        />
                        <Button variant="contained" type="submit">
                          {t('ForgotPassword.resetPassword')}
                        </Button>
                      </Stack>
                    </form>
                  )}
                  {index === 1 && (
                    <Stack spacing={1}>
                      <Typography variant="h4" color="textSecondary">
                        {t('ForgotPassword.checkYourInbox')}
                      </Typography>
                      <Typography variant="body1">
                        {t('ForgotPassword.followInstructions')}
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
