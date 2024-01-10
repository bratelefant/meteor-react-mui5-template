import {
  cleanup, fireEvent, render, waitFor,
} from '@testing-library/react';
import chai, { expect } from 'chai';
import chaiDom from 'chai-dom';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import i18n from '../../imports/common/i18n';
import { UserProvider } from '../../imports/ui/UserProvider';
import ResetPassword from '../../imports/ui/ResetPassword';

if (Meteor.isClient) {
  chai.use(chaiDom);

  describe('<ResetPassword />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' });
      await i18n.changeLanguage('en');
      await i18n.loadNamespaces(['ResetPassword']);
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
              <ResetPassword />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
    });

    it('shows three steps to reset password', async () => {
      const { getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ResetPassword />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      await waitFor(() => getByText(i18n.t('choose password', { ns: 'ResetPassword' })));
      await waitFor(() => getByText(i18n.t('confirm password', { ns: 'ResetPassword' })));
      await waitFor(() => getByText(i18n.t('done', { ns: 'ResetPassword' })));
    });

    it('asks for a password', async () => {
      const { getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ResetPassword />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      await waitFor(() => getByText(i18n.t('choose password', { ns: 'ResetPassword' })));
    });

    it('renders a continue button', async () => {
      const { getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ResetPassword />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      await waitFor(() => getByText(i18n.t('continue', { ns: 'ResetPassword' })));
    });

    it('asks for a password confirmation after clicking continue', async () => {
      const { getByText, container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ResetPassword />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      fireEvent.click(getByText(i18n.t('continue', { ns: 'ResetPassword' })));
      const confirmPassword = container.querySelector('input[name="confirmPassword"]');
      expect(confirmPassword).to.exist;
    });
  });
}
