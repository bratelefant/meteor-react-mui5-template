import React, { useState } from "react";
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
} from "@mui/material";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState(null);
  const { t, i18n } = useTranslation(["SignUp"]);

  const steps = [t("Enter Email"), t("Check your inbox")];

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await Meteor.callAsync("user.signup", email, i18n.language);
      setActiveStep(1);
    } catch (error) {
      setError(error.reason);
      console.error(error);
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
                          label={t("email")}
                          autoFocus
                          error={!!error}
                          helperText={
                            error?.includes("Email already exists")
                              ? t("Email already registered")
                              : error
                          }
                          variant="outlined"
                          value={email}
                          onChange={handleEmailChange}
                        />
                        <Button variant="contained" type="submit">
                          {t("Create account")}
                        </Button>
                      </Stack>
                    </form>
                  )}
                  {index === 1 && (
                    <Stack spacing={1}>
                      <Typography variant="h4" color="textSecondary">
                        {t("You've got mail!")}
                      </Typography>
                      <Typography variant="body1">
                        {t("Please check your inbox for further instructions")}
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
};

export default SignUp;