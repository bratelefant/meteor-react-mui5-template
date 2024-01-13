/**
 * A signup Component.
 *
 * @locus Client
 * @module imports/ui/SignUp
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
 * @function SignUp
 * @description React component that provides a simple stepper to sign up a new user. Only an email
 * is required. We do not want to ask for a password here, because we want to send a link to the
 * user's email address to set the password. This way we can be sure that
 * the email address is valid.
 * @returns {ReactNode} - The component displayed.
 */
function SignUp() {
  const [email, setEmail] = useState('');
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation(['bratelefant_mrm-locales']);

  const steps = [t('SignUp.step.enterEmail'), t('SignUp.step.checkYourInbox')];

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await Meteor.callAsync('user.signup', email, i18n.language);
      setActiveStep(1);
    } catch (err) {
      setError(err.reason);
    }
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
                          label={t('SignUp.email')}
                          autoFocus
                          error={!!error}
                          helperText={
                            error?.includes('Email already exists')
                              ? t('SignUp.emailAlreadyRegistered')
                              : error
                          }
                          variant="outlined"
                          name="email"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        <Button variant="contained" type="submit">
                          {t('SignUp.createAccount')}
                        </Button>
                      </Stack>
                    </form>
                  )}
                  {index === 1 && (
                    <Stack spacing={1}>
                      <Typography variant="h4" color="textSecondary">
                        {t('SignUp.youHaveMail')}
                      </Typography>
                      <Typography variant="body1">
                        {t('SignUp.followInstructions')}
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

export default SignUp;
