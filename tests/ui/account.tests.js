import { render, fireEvent, cleanup } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import { I18nextProvider } from 'react-i18next';
import Account from '../../imports/ui/Account';
import i18n from '../../imports/common/i18n';
import { UserProvider } from '../../imports/ui/UserProvider';

if (Meteor.isClient) {
  describe('<Account />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' }); // now Meteor.user() will return the user we just created

      await i18n.loadNamespaces('Account');
    });

    afterEach(() => {
      cleanup();
      sinon.restore();
    });

    it('renders without crashing', () => {
      render(<Account />);
    });

    it('will not render if user is not logged in', () => {
      Meteor.user.returns(null);
      Meteor.userAsync.resolves(null);
      const { container } = render(
        <UserProvider>
          <I18nextProvider i18n={i18n}>
            <Account />
          </I18nextProvider>
        </UserProvider>,
      );
      expect(container.firstChild).to.be.equal(null);
    });

    it('render the title of the card', () => {
      const { getByText } = render(
        <UserProvider>
          <I18nextProvider i18n={i18n}>
            <Account />
          </I18nextProvider>
        </UserProvider>,
      );
      expect(
        getByText(
          i18n.t('title', {
            ns: 'Account',
          }),
        ),
      ).to.be.instanceOf(HTMLElement);
    });

    it('renders a form', () => {
      const { getByRole } = render(
        <UserProvider>
          <I18nextProvider i18n={i18n}>
            <Account />
          </I18nextProvider>
        </UserProvider>,
      );
      expect(getByRole('form')).to.be.instanceOf(HTMLElement);
    });

    it('renders input fields', () => {
      const dom = render(
        <UserProvider>
          <I18nextProvider i18n={i18n}>
            <Account />
          </I18nextProvider>
        </UserProvider>,
      );
      const inputs = dom.container.querySelectorAll('input:not([type="hidden"])');
      expect(inputs).to.have.lengthOf(3);
      expect(inputs[0]).to.be.instanceOf(HTMLElement);
      expect(inputs[1]).to.be.instanceOf(HTMLElement);
      expect(inputs[2]).to.be.instanceOf(HTMLElement);

      expect(inputs[0].name).to.equal('oldPassword');
      expect(inputs[1].name).to.equal('newPassword');
      expect(inputs[2].name).to.equal('newPasswordConfirm');

      expect(inputs[0].type).to.equal('password');
      expect(inputs[1].type).to.equal('password');
      expect(inputs[2].type).to.equal('password');
    });

    it('renders a submit button', () => {
      const { container } = render(
        <UserProvider>
          <I18nextProvider i18n={i18n}>
            <Account />
          </I18nextProvider>
        </UserProvider>,
      );
      const button = container.querySelector('button[type="submit"]');
      expect(button).to.be.instanceOf(HTMLElement);
      expect(button.textContent).to.equal(
        i18n.t('submit', {
          ns: 'Account',
        }),
      );
    });

    it('updates the input field value when typed into', () => {
      const { container } = render(
        <UserProvider>
          <I18nextProvider i18n={i18n}>
            <Account />
          </I18nextProvider>
        </UserProvider>,
      );
      const input = container.querySelector('input[name="oldPassword"]');
      fireEvent.change(input, { target: { value: 'new password' } });
      expect(input.value).to.equal('new password');
    });
  });
}
