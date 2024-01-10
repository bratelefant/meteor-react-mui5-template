import {
  cleanup, render,
} from '@testing-library/react';
import chai, { expect } from 'chai';
import chaiDom from 'chai-dom';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import i18n from '../../imports/common/i18n';
import Login from '../../imports/ui/Login';
import { UserProvider } from '../../imports/ui/UserProvider';

if (Meteor.isClient) {
  chai.use(chaiDom);

  describe('<Login />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' });
      await i18n.changeLanguage('en');
      await i18n.loadNamespaces(['Login']);
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
              <Login />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
    });

    it('shows a login screen with an email and password field', () => {
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Login />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(container).to.contain.text(i18n.t('email'));
      expect(container).to.contain.text(i18n.t('password'));
    });

    it('shows a login, signup and forgotten password button', () => {
      const { getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Login />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(getByText(i18n.t('signin', { ns: 'Login' }))).to.exist;
      expect(getByText(i18n.t('signup', { ns: 'Login' }))).to.exist;
      expect(getByText(i18n.t('forgottenPassword', { ns: 'Login' }))).to.exist;
    });

    it('shows a loading indicator when logging in', () => {
      sinon.stub(Meteor, 'loggingIn');
      Meteor.loggingIn.returns(true);
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Login />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(container.getElementsByClassName('MuiCircularProgress-indeterminate')).to.have.lengthOf(1);
    });
  });
}
