import {
  cleanup,
  render,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import chai, { expect } from 'chai';
import chaiDom from 'chai-dom';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import i18n from '../../imports/common/i18n';
import Enroll from '../../imports/ui/Enroll';
import { UserProvider } from '../../imports/ui/UserProvider';

if (Meteor.isClient) {
  chai.use(chaiDom);

  describe('<Enroll />', () => {
    beforeEach(async () => {
      render(
        <Router>
          <Navigate to="/enroll/12345" />
        </Router>,
      );
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' });
      await i18n.changeLanguage('en');
      await i18n.loadNamespaces('Enroll');
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
              <Enroll />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
    });

    it('returns the user to the home page if no token is provided', () => {
      render(
        <Router>
          <Navigate to="/enroll" />
        </Router>,
      );
      render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Enroll />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(window.location.pathname).to.equal('/');
    });

    it('displays a stepper if a token is provided via the url', () => {
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Enroll />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );

      expect(container.getElementsByClassName('MuiStepper-root')).to.have.lengthOf(1);
    });

    it('displays a password field if the user is on the first step', () => {
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Enroll />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );

      expect(container.getElementsByClassName('MuiInputBase-input')).to.have.lengthOf(1);
      expect(container.getElementsByClassName('MuiInputBase-input')[0]).to.have.attribute('type', 'password');
    });

    it('shows the second step if the user enters and submits a password with a confirm password input', async () => {
      const { container, getAllByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Enroll />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );

      const passwordInput = container.getElementsByClassName('MuiInputBase-input')[0];
      const button = container.getElementsByClassName('MuiButtonBase-root')[0];
      await userEvent.type(passwordInput, 'password');
      await userEvent.click(button);
      expect(container.getElementsByClassName('MuiInputBase-input')).to.have.lengthOf(2);
      const confirmPasswordInput = container.getElementsByClassName('MuiInputBase-input')[1];
      expect(confirmPasswordInput).to.have.attribute('type', 'password');
      expect(confirmPasswordInput).to.have.attribute('aria-invalid', 'false');
      expect(getAllByText((i18n.t('confirm password', { ns: 'Enroll' })))).to.have.lengthOf(3);
    });

    it('shows an error if the users re-entered password does not match the first', async () => {
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Enroll />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );

      const passwordInput = container.getElementsByClassName('MuiInputBase-input')[0];
      const button = container.getElementsByClassName('MuiButtonBase-root')[0];
      await userEvent.type(passwordInput, 'password');
      await userEvent.click(button);
      const confirmPasswordInput = container.getElementsByClassName('MuiInputBase-input')[1];
      await userEvent.type(confirmPasswordInput, 'not the same password');
      const continueButton = container.getElementsByClassName('MuiButtonBase-root')[1];
      await userEvent.click(continueButton);
      waitFor(() => {
        expect(confirmPasswordInput).to.have.attribute('aria-invalid', 'true');
      });
    });
  });
}
