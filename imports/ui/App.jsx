import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
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

function App() {
  return (
    <I18nextProvider i18n={i18n} defaultNS="translation">
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
    </I18nextProvider>
  );
}

export default App;
