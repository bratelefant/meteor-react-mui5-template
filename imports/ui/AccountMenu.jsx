/**
 * Displays a menu to access the account page and to logout.
 *
 * @locus Client
 * @module imports/ui/AccountMenu
 */
import React, { useEffect } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrentUser } from './UserProvider';

/**
 * @function AccountMenu
 * @description React component that provides a menu to access the account page and to logout.
 * @returns {JSX.Element} - AccountMenu
 */
function AccountMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = useCurrentUser();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    handleClose();
  }, [location?.pathname]);

  if (!user) {
    return null;
  }

  return (
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
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={async () => {
            navigate('/account');
            handleClose();
          }}
        >
          {t('AccountMenu.account')}
        </MenuItem>
        <MenuItem
          onClick={async () => {
            navigate('/');
            Accounts.logout();
            handleClose();
          }}
        >
          {t('AccountMenu.logout')}
        </MenuItem>
      </Menu>
    </div>
  );
}

export default AccountMenu;
