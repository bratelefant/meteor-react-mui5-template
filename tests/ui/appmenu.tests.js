import { render } from '@testing-library/react';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../imports/common/i18n';
import { UserProvider } from '../../imports/ui/UserProvider';
import AppMenu from '../../imports/ui/AppMenu';

if (Meteor.isClient) {
  describe('<AppMenu />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' }); // now Meteor.user() will return the user we just created
      await i18n.loadNamespaces('AppMenu');
    });

    afterEach(() => {
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
              <AppMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
    });

    it('will not render if user is not logged in', () => {
      Meteor.user.returns(null);
      Meteor.userAsync.resolves(null);
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AppMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(container.firstChild).to.be.equal(null);
    });

    it('will not render if pathname starts with /enroll', () => {
      render(
        <Router>
          <Navigate to="/enroll" />
        </Router>,
      );
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AppMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );

      expect(container.firstChild).to.be.equal(null);
    });

    it('will not render if pathname starts with /login', () => {
      render(
        <Router>
          <Navigate to="/login" />
        </Router>,
      );
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AppMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );

      expect(container.firstChild).to.be.equal(null);
    });

    it('will not render if pathname starts with /reset-password', () => {
      render(
        <Router>
          <Navigate to="/reset-password" />
        </Router>,
      );
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AppMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );

      expect(container.firstChild).to.be.equal(null);
    });

    it('will render on the home screen if the user is logged in', () => {
      render(
        <Router>
          <Navigate to="/" />
        </Router>,
      );
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AppMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );

      expect(container.firstChild).to.not.be.equal(null);
    });
  });
}
