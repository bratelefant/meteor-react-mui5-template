import React from "react";
import {
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MenuDrawer from "./MenuDrawer";
import { useNavigate, useLocation } from "react-router-dom";
import { ChooseLanguage } from "./ChooseLanguage";
import { useTranslation } from "react-i18next";
import { useCurrentUser } from "./UserProvider";

export const AppMenu = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const user = useCurrentUser();
  const { t } = useTranslation(["AppMenu"]);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  if (
    !user ||
    location.pathname.startsWith("/enroll") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/login")
  )
    return null;

  return (
    <AppBar position="sticky">
      <Toolbar>
        <MenuDrawer />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {Meteor.settings.public.name}
        </Typography>
        <ChooseLanguage variant="iconbutton" />
        <div>
          <IconButton
            size="large"
            aria-label="account of current user"
            aria-controls="menu-appbar"
            aria-haspopup="true"
            onClick={handleMenu}
            color="inherit"
          >
            <AccountCircle />
          </IconButton>

          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/account");
              }}
            >
              {t("account")}
            </MenuItem>
            <MenuItem
              onClick={() => {
                handleClose();
                navigate("/");
                Accounts.logout();
              }}
            >
              {t("logout")}
            </MenuItem>
          </Menu>
        </div>
      </Toolbar>
    </AppBar>
  );
};
