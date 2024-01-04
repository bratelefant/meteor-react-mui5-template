import React from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Stack,
  TextField,
} from "@mui/material";
import { Accounts } from "meteor/accounts-base";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "./UserProvider";

export const Account = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [paswordConfirm, setPasswordConfirm] = useState("");
  const [error, setError] = useState({});
  const [success, setSuccess] = useState();
  const { t } = useTranslation(["Account"]);
  const user = useCurrentUser();

  const onSubmit = (e) => {
    e.preventDefault();
    if (password.trim() === "") {
      setError({ password: "Passwort darf nicht leer sein." });
      return;
    }
    if (password !== paswordConfirm) {
      setError({ passwordConfirm: "Passwörter stimmen nicht überein." });
      return;
    }
    Accounts.changePassword(oldPassword, password, (err) => {
      if (err) {
        setError({ oldPassword: err.reason });
        setSuccess(false);
      } else {
        setError({});
        setSuccess(true);
      }
    });
  };

  return (
    <Container maxWidth="sm">
      <form onSubmit={onSubmit}>
        <Card>
          <CardHeader title={t("title")} />
          <CardContent>
            {success ? (
              <Box>
                <Alert severity="success">
                  {t("password successfully changed")}
                </Alert>
              </Box>
            ) : (
              <Stack spacing={1}>
                <input
                  type="hidden"
                  style={{ display: "none" }}
                  value={user?.emails?.find((e) => e.verified)?.address || ""}
                />
                <TextField
                  id="oldPassword"
                  autoComplete="current-password"
                  label={t("current password")}
                  variant="outlined"
                  margin="normal"
                  type="password"
                  error={!!error["oldPassword"]}
                  helperText={error["oldPassword"]}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                />
                <TextField
                  id="password"
                  autoComplete="new-password"
                  error={!!error["password"]}
                  helperText={error["password"]}
                  label={t("new password")}
                  variant="outlined"
                  margin="normal"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <TextField
                  id="passwordConfirm"
                  autoComplete="new-password"
                  error={!!error["passwordConfirm"]}
                  helperText={error["passwordConfirm"]}
                  label={t("confirm new password")}
                  variant="outlined"
                  margin="normal"
                  type="password"
                  value={paswordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </Stack>
            )}
          </CardContent>
          <CardActions>
            {!success && (
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
              >
                {t("submit")}
              </Button>
            )}
            {success && (
              <Button
                onClick={() => {
                  setError({});
                  setOldPassword("");
                  setPassword("");
                  setPasswordConfirm("");
                  setSuccess(false);
                }}
              >
                {t("Account:reset")}
              </Button>
            )}
          </CardActions>
        </Card>
      </form>
    </Container>
  );
};
