/**
 * Main application component.
 *
 * @locus Client
 * @module imports/ui/App
 */
import React, {
  Suspense, useEffect, useMemo, useState,
} from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { createTheme } from '@mui/material/styles';
import { indigo, pink } from '@mui/material/colors';
import { ThemeProvider } from '@emotion/react';
import { deDE as dataGridDeDE, enUS as dataGridEnUS } from '@mui/x-data-grid';
import { deDE as coreDeDE, enUS as coreEnUS } from '@mui/material/locale';
import Home from './Home';
import Login from './Login';
import SignUp from './SignUp';
import Enroll from './Enroll';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Account from './Account';
import AppMenu from './AppMenu';
import i18n from '../common/i18n';
import Loading from './Loading';
import { UserProvider } from './UserProvider';

const theme = createTheme(
  {
    palette: {
      primary: indigo,
      secondary: pink,
    },
  },
);

function App() {
  const locales = {
    de: [dataGridDeDE, coreDeDE],
    en: [dataGridEnUS, coreEnUS],
  };

  const [locale, setLocale] = useState(i18n.language || Meteor.settings.public.defaultLanguage);
  const themeWithLocale = useMemo(
    () => createTheme(theme, ...(locales[locale])),
    [locale, theme],
  );
  useEffect(() => {
    i18n.on('languageChanged', (lng) => {
      setLocale(lng);
    });
  }, []);
  return (
    <I18nextProvider i18n={i18n} defaultNS="bratelefant_mrm-locales">
      <ThemeProvider theme={themeWithLocale}>
        <BrowserRouter>
          <Suspense fallback={<Loading open />}>
            <UserProvider>
              <AppMenu />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/account" element={<Account />} />
                <Route path="/login" element={<Login />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/forgotten-password" element={<ForgotPassword />} />
                <Route path="/enroll/:token" element={<Enroll />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
              </Routes>
            </UserProvider>
          </Suspense>
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>

  );
}

export default App;
