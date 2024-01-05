/**
 * Menu drawer component.
 *
 * @locus Client
 * @module imports/ui/MenuDrawer
 */
import React, { useEffect } from 'react';
import { Home } from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

/**
 * @function MenuDrawer
 * @description React component that provides a drawer menu. Includes tha logo and app
 * name on top and a link to the home page.
 * @returns {ReactNode} - The component displayed.
 */
export default function MenuDrawer() {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const { t } = useTranslation('MenuDrawer');
  const { location } = useLocation();

  const { pathname } = location;

  const toggleDrawer = (pOpen) => (event) => {
    if (
      event.type === 'keydown'
      && (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setOpen(pOpen);
  };

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <div>
      <IconButton
        size="large"
        edge="start"
        color="inherit"
        aria-label="menu"
        sx={{ mr: 2 }}
        onClick={() => setOpen(true)}
      >
        <MenuIcon />
      </IconButton>
      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{ width: 'auto', minWidth: '230px' }}
          role="presentation"
          onClick={toggleDrawer(false)}
          onKeyDown={toggleDrawer(false)}
        >
          <List>
            <ListItem>
              <ListItemIcon>
                <Icon component="img" src="/images/logo.png" alt="Logo" />
              </ListItemIcon>
              <ListItemText primary={Meteor.settings.public.name} />
            </ListItem>
            <Divider />
            <ListItem disablePadding>
              <ListItemButton onClick={() => navigate('/')}>
                <ListItemIcon>
                  <Home />
                </ListItemIcon>
                <ListItemText primary={t('home')} />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  );
}
