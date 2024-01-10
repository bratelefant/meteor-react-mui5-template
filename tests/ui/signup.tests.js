import {
  cleanup, render, waitFor,
} from '@testing-library/react';
import chai, { expect } from 'chai';
import chaiDom from 'chai-dom';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import i18n from '../../imports/common/i18n';
import { UserProvider } from '../../imports/ui/UserProvider';
import SignUp from '../../imports/ui/SignUp';

if (Meteor.isClient) {
  chai.use(chaiDom);

  describe('<SignUp />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' });
      await i18n.changeLanguage('en');
      await i18n.loadNamespaces(['SignUp']);
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
              <SignUp />
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
              <SignUp />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      await waitFor(() => getByText(i18n.t('Enter Email', { ns: 'SignUp' })));
      await waitFor(() => getByText(i18n.t('Check your inbox', { ns: 'SignUp' })));
    });

    it('asks for an email', async () => {
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <SignUp />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      const emailInput = container.querySelector('input[name="email"]');
      expect(emailInput).to.have.attr('type', 'text');
    });

    it('renders a "Create Account" button', async () => {
      const { getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <SignUp />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      const button = getByText(i18n.t('Create account', { ns: 'SignUp' }));
      expect(button).to.be.instanceOf(HTMLElement);
    });
  });
}
