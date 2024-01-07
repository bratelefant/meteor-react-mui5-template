/**
 * The main application menu.
 *
 * @locus Client
 * @module imports/ui/AppMenu
 */
import React from 'react';
import {
  Typography,
  AppBar,
  Toolbar,
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import MenuDrawer from './MenuDrawer';
import ChooseLanguage from './ChooseLanguage';
import { useCurrentUser } from './UserProvider';
import AccountMenu from './AccountMenu';

/**
 * @function AppMenu
 * @description The main application menu.
 * @returns {JSX.Element} - AppMenu
 */
function AppMenu() {
  const location = useLocation();
  const user = useCurrentUser();

  if (
    !user
    || location?.pathname.startsWith('/enroll')
    || location?.pathname.startsWith('/reset-password')
    || location?.pathname.startsWith('/login')
  ) return null;

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
}

export default AppMenu;
