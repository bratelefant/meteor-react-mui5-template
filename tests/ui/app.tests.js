import { cleanup, render } from '@testing-library/react';
import React from 'react';
import { expect } from 'chai';
import sinon from 'sinon';
import i18n from '../../imports/common/i18n';
import App from '../../imports/ui/App';

if (Meteor.isClient) {
  describe('<App />', () => {
    beforeEach(async () => {
      await i18n.loadNamespaces(['Login']);
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' }); // now Meteor.user() will return the user we just created
    });

    afterEach(() => {
      cleanup();
      sinon.restore();
    });

    it('renders without crashing', () => {
      render(
        <App />,
      );
    });

    it('renders the home component', () => {
      const { container } = render(
        <App />,
      );
      expect(container.querySelectorAll('#home')).to.have.lengthOf(1);
    });

    it('navigates to login component when not logged in', () => {
      Meteor.user.returns(null);
      Meteor.userAsync.resolves(null);
      render(
        <App />,
      );
      expect(window.location.pathname).to.be.equal('/login');
    });
  });
}
