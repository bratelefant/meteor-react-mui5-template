import { cleanup, render, waitFor } from '@testing-library/react';
import chai, { expect } from 'chai';
import chaiDom from 'chai-dom';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import i18n from '../../imports/common/i18n';
import Home from '../../imports/ui/Home';
import { UserProvider } from '../../imports/ui/UserProvider';

if (Meteor.isClient) {
  chai.use(chaiDom);

  describe('<Home />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' });
      await i18n.changeLanguage('en');
      await i18n.loadNamespaces(['Home', 'Welcome']);
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
              <Home />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
    });

    it('shows a welcome message', async () => {
      const { getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Home />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      await waitFor(() => getByText(i18n.t('headline', { ns: 'Welcome', appName: Meteor.settings.public.name })));
    });

    it('redirects to /login when user is not logged in', async () => {
      Meteor.user.returns(null);
      Meteor.userAsync.resolves(null);
      render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Home />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(window.location.pathname).to.equal('/login');
    });
  });
}
