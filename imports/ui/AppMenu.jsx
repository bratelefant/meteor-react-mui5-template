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
import { AccountMenu } from "./AccountMenu";

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
        <AccountMenu />
      </Toolbar>
    </AppBar>
  );
};
