/**
 * React component that provides a menu to choose the language.
 *
 * @locus Client
 * @module imports/ui/ChooseLanguage
 */
import { Language } from '@mui/icons-material';
import {
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from '@mui/material';
import React, { useContext } from 'react';
import { I18nContext, useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { useCurrentUser } from './UserProvider';

/**
 * @function Allows the user to choose the language. The state will also be saved in the users
 * profile, so that server side texts (e.g. for emails) can be translated properly.
 * @param {Object} props - React props.
 * @param {('iconbutton'|'select')} [props.variant] - The variant of the component.
 * Default is 'select'.
 * @returns {JSX.Element} - React component.
 */
function ChooseLanguage({ variant = 'select' }) {
  const { i18n } = useContext(I18nContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = useCurrentUser();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { t } = useTranslation(['bratelefant_mrm-locales']);

  const changeLanguage = async (value) => {
    if (user) {
      await Meteor.users.updateAsync(user._id, {
        $set: {
          profile: { language: value },
        },
      });
    }
    i18n.changeLanguage(value);
  };

  const onChange = async (e) => {
    changeLanguage(e.target.value);
  };

  if (!Meteor.settings?.public?.languages || Meteor.settings.public.languages.length === 1) {
    return null;
  }

  if (variant === 'iconbutton') {
    return (
      <div>
        <IconButton
          size="large"
          aria-label="language"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleMenu}
          color="inherit"
        >
          <Language color="inherit" />
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
          {Meteor.settings.public.languages.map((lang) => (
            <MenuItem
              key={lang}
              onClick={() => {
                changeLanguage(lang);
                handleClose();
              }}
            >
              {t(`ChooseLanguage.${lang}`)}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }

  return (
    <FormControl>
      <InputLabel id="sel-lang">
        {t('ChooseLanguage.language')}
      </InputLabel>
      <Select
        size="small"
        startAdornment={(
          <Language
            fontSize="inherit"
            color="textSecondary"
            sx={{ marginRight: 1 }}
          />
        )}
        labelId="sel-lang"
        onChange={onChange}
        value={i18n.language}
        label={t('ChooseLanguage.language')}
      >
        {Meteor.settings.public.languages.map((lang) => (
          <MenuItem key={lang} value={lang}>
            {lang}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

ChooseLanguage.propTypes = {
  variant: PropTypes.oneOf(['iconbutton', 'select']).isRequired,
};

export default ChooseLanguage;
