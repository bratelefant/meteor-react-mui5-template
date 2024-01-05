import React, { useEffect } from 'react';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function AccountMenu() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation(['AppMenu']);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const { pathname } = location;

  useEffect(() => {
    handleClose();
  }, [pathname]);

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
          {t('account')}
        </MenuItem>
        <MenuItem
          onClick={async () => {
            navigate('/');
            Accounts.logout();
            handleClose();
          }}
        >
          {t('logout')}
        </MenuItem>
      </Menu>
    </div>
  );
}

export default AccountMenu;
