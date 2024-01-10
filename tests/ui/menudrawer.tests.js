import { cleanup, fireEvent, render } from '@testing-library/react';
import chai, { expect } from 'chai';
import chaiDom from 'chai-dom';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import i18n from '../../imports/common/i18n';
import { UserProvider } from '../../imports/ui/UserProvider';
import MenuDrawer from '../../imports/ui/MenuDrawer';

if (Meteor.isClient) {
  chai.use(chaiDom);

  describe('<MenuDrawer />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' });
      await i18n.changeLanguage('en');
      await i18n.loadNamespaces(['MenuDrawer']);
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
              <MenuDrawer />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
    });

    it('displays an iconbutton with a menu icon', () => {
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <MenuDrawer />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      const iconButton = container.querySelector('button');
      expect(iconButton).to.have.class('MuiIconButton-root');
      const icon = container.querySelector('svg');
      expect(icon).to.have.class('MuiSvgIcon-root');
    });

    it('displays a drawer with a list of menu items after button is clicked', async () => {
      const { getByText, getByRole } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <MenuDrawer />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );

      fireEvent.click(getByRole('button'));
      expect(getByText(i18n.t('home', { ns: 'MenuDrawer' }))).to.exist;
      expect(getByText(Meteor.settings.public.name)).to.exist;
    });

    it('navigates to / when home is clicked', async () => {
      render(
        <Router>
          <Navigate to="/somewhere" />
        </Router>,
      );

      const { getByText, getByRole } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <MenuDrawer />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );

      fireEvent.click(getByRole('button'));
      fireEvent.click(getByText(i18n.t('home', { ns: 'MenuDrawer' })));
      expect(window.location.pathname).to.equal('/');
    });
  });
}
