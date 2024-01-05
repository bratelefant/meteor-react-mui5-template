import React, { Suspense } from "react";
import { Home } from "./Home";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import SignUp from "./SignUp";
import Enroll from "./Enroll";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import { Account } from "./Account";
import { AppMenu } from "./AppMenu";
import { I18nextProvider } from "react-i18next";
import i18n from "../../imports/common/i18n";
import { Loading } from "./Loading";
import { UserProvider } from "./UserProvider";

export const App = () => {
  
  return (
    <I18nextProvider i18n={i18n} defaultNS={"translation"}>
      <BrowserRouter>
        <Suspense fallback={<Loading open={true} />}>
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
};
