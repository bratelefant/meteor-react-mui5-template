import { Language } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  Menu,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useContext } from "react";
import { I18nContext, useTranslation } from "react-i18next";
import { useCurrentUser } from "./UserProvider";

export const ChooseLanguage = ({ variant }) => {
  const { i18n } = useContext(I18nContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const user = useCurrentUser();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const { t } = useTranslation(["translation", "ChooseLanguage"]);

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

  if (variant === "iconbutton") {
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
          {Meteor.settings.public.languages.map((lang) => {
            return (
              <MenuItem
                key={lang}
                onClick={() => {
                  changeLanguage(lang);
                  handleClose();
                }}
              >
                {t(lang, { ns: "ChooseLanguage" })}
              </MenuItem>
            );
          })}
        </Menu>
      </div>
    );
  }

  return (
    <FormControl>
      <InputLabel id="sel-lang">
        {t("language", { ns: "ChooseLanguage" })}
      </InputLabel>
      <Select
        size="small"
        startAdornment={
          <Language
            fontSize="inherit"
            color="textSecondary"
            sx={{ marginRight: 1 }}
          />
        }
        labelId="sel-lang"
        onChange={onChange}
        value={i18n.language}
        label={t("language", { ns: "ChooseLanguage" })}
      >
        {Meteor.settings.public.languages.map((lang) => {
          return (
            <MenuItem key={lang} value={lang}>
              {lang}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};
