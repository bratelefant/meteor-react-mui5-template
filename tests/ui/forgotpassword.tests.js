import {
  cleanup,
  render,
  waitFor,
} from '@testing-library/react';
import chai from 'chai';
import chaiDom from 'chai-dom';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import i18n from '../../imports/common/i18n';
import ForgotPassword from '../../imports/ui/ForgotPassword';
import { UserProvider } from '../../imports/ui/UserProvider';

if (Meteor.isClient) {
  chai.use(chaiDom);

  describe('<ForgotPassword />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' });
      await i18n.changeLanguage('en');
      await i18n.loadNamespaces('ForgotPassword');
    });

    afterEach(() => {
      cleanup();
      sinon.restore();
    });

    after(() => {
      render(
        <Router>
          <Navigate to="/" />
        </Router>,
      );
    });

    it('renders without crashing', () => {
      render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
    });

    it('shows two steps to reset password', async () => {
      const { getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      await waitFor(() => getByText(i18n.t('enter your email', { ns: 'ForgotPassword' })));
      await waitFor(() => getByText(i18n.t('check your inbox', { ns: 'ForgotPassword' })));
    });

    it('asks for email address', async () => {
      const { getByText, getByPlaceholderText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      await waitFor(() => getByText(i18n.t('enter your email', { ns: 'ForgotPassword' })));
      await waitFor(() => getByText(i18n.t('check your inbox', { ns: 'ForgotPassword' })));
      await waitFor(() => getByPlaceholderText(i18n.t('email', { ns: 'ForgotPassword' })));
    });

    it('renders a button to send the reset email', async () => {
      const { getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ForgotPassword />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      await waitFor(() => getByText(i18n.t('reset password', { ns: 'ForgotPassword' })));
    });
  });
}
