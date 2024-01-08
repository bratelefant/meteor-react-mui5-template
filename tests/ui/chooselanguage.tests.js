import {
  cleanup,
  fireEvent,
  render,
  screen, waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import chai, { expect } from 'chai';
import chaiDom from 'chai-dom';
import React from 'react';
import { I18nextProvider } from 'react-i18next';
import { Navigate, BrowserRouter as Router } from 'react-router-dom';
import sinon from 'sinon';
import i18n from '../../imports/common/i18n';
import ChooseLanguage from '../../imports/ui/ChooseLanguage';
import { UserProvider } from '../../imports/ui/UserProvider';

if (Meteor.isClient) {
  chai.use(chaiDom);

  describe('<ChooseLanguage />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' }); // now Meteor.user() will return the user we just created
      await i18n.changeLanguage('en');
      await i18n.loadNamespaces('ChooseLanguage');
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
              <ChooseLanguage variant="iconbutton" />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
    });

    it('will render a select if variant is select', () => {
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ChooseLanguage variant="select" />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(container.querySelectorAll('.MuiSelect-select')).to.have.lengthOf(1);
    });

    it('will render an iconbutton if variant is iconbutton', () => {
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ChooseLanguage variant="iconbutton" />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(container.querySelectorAll('.MuiIconButton-root')).to.have.lengthOf(1);
    });

    it('will render a language menu if variant is iconbutton and if iconbutton is clicked', () => {
      const { getByRole, getByText } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ChooseLanguage variant="iconbutton" />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(getByText(i18n.t('en', { ns: 'ChooseLanguage' }))).to.not.be.visible;
      expect(getByText(i18n.t('de', { ns: 'ChooseLanguage' }))).to.not.be.visible;
      fireEvent.click(getByRole('button'), new MouseEvent('click', { bubbles: true, cancelable: true }));
      expect(getByText(i18n.t('en', { ns: 'ChooseLanguage' }))).to.be.visible;
      expect(getByText(i18n.t('de', { ns: 'ChooseLanguage' }))).to.be.visible;
    });

    it('will render a language menu if variant is select and if select input is clicked', async () => {
      render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ChooseLanguage variant="select" />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      const select = screen.getByRole('combobox');
      await userEvent.click(select);

      await waitFor(() => screen.getAllByRole('option'));

      expect(screen.getAllByRole('option')).to.have.lengthOf(2);
    });

    it('will return null, if there is only one language', () => {
      sinon.stub(Meteor.settings.public, 'languages').value(['en']);
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <ChooseLanguage variant="iconbutton" />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(container.querySelectorAll('.MuiIconButton-root')).to.have.lengthOf(0);
    });
  });
}
