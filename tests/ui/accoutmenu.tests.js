import { render, fireEvent, cleanup } from '@testing-library/react';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { I18nextProvider } from 'react-i18next';
import AccountMenu from '../../imports/ui/AccountMenu';
import i18n from '../../imports/common/i18n';
import { UserProvider } from '../../imports/ui/UserProvider';

if (Meteor.isClient) {
  describe('<AccountMenu />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' }); // now Meteor.user() will return the user we just created
      await i18n.loadNamespaces('AppMenu');
    });

    afterEach(() => {
      cleanup();
      sinon.restore();
    });

    after(() => {
      render(<Router><Navigate to="/" /></Router>);
    });

    it('renders without crashing', () => {
      render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AccountMenu />
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
              <AccountMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(container.firstChild).to.be.equal(null);
    });

    it('will render a button, that shows the menu', () => {
      const { getByRole } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AccountMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(getByRole('button')).to.be.instanceOf(HTMLElement);
    });

    it('will show the menu, when the button is clicked', () => {
      const { getByRole, getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AccountMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      fireEvent.click(getByRole('button'));
      expect(
        getByText(
          i18n.t('account', {
            ns: 'AppMenu',
          }),
        ),
      ).to.be.instanceOf(HTMLElement);
      expect(
        getByText(
          i18n.t('logout', {
            ns: 'AppMenu',
          }),
        ),
      ).to.be.instanceOf(HTMLElement);
    });

    it('will call Accounts.logout when the logout button is clicked', () => {
      const { getByRole, getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AccountMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      fireEvent.click(getByRole('button'));
      const logoutButton = getByText(
        i18n.t('logout', {
          ns: 'AppMenu',
        }),
      );
      expect(logoutButton).to.be.instanceOf(HTMLElement);
      fireEvent.click(logoutButton);
      expect(Accounts.logout.calledOnce).to.be.equal(true);

      Accounts.logout.restore();
    });

    it('navigates to /account when the account button is clicked', () => {
      const { getByRole, getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AccountMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      fireEvent.click(getByRole('button'));
      const accountButton = getByText(
        i18n.t('account', {
          ns: 'AppMenu',
        }),
      );
      expect(accountButton).to.be.instanceOf(HTMLElement);
      fireEvent.click(accountButton);
      expect(window.location.pathname).to.be.equal('/account');
    });

    it('hides the menu when the logout button is clicked', () => {
      const { getByRole, getByText, queryByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AccountMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      fireEvent.click(getByRole('button'));
      const logoutButton = getByText(
        i18n.t('logout', {
          ns: 'AppMenu',
        }),
      );
      expect(logoutButton).to.be.instanceOf(HTMLElement);
      fireEvent.click(logoutButton);
      expect(queryByText('logout')).to.be.equal(null);
    });

    it('hides the menu when the account button is clicked', () => {
      const { getByRole, getByText, queryByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <AccountMenu />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      fireEvent.click(getByRole('button'));
      const accountButton = getByText(
        i18n.t('account', {
          ns: 'AppMenu',
        }),
      );
      expect(accountButton).to.be.instanceOf(HTMLElement);
      fireEvent.click(accountButton);
      expect(queryByText('account')).to.be.equal(null);
    });
  });
}
