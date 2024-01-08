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
import Loading from '../../imports/ui/Loading';
import { UserProvider } from '../../imports/ui/UserProvider';

if (Meteor.isClient) {
  chai.use(chaiDom);

  describe('<Loading />', () => {
    beforeEach(async () => {
      sinon.stub(Meteor, 'user');
      sinon.stub(Meteor, 'userAsync');
      sinon.stub(Accounts, 'logout');
      Meteor.user.returns({ _id: '123' });
      Meteor.userAsync.resolves({ _id: '123' });
      await i18n.changeLanguage('en');
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
              <Loading />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
    });

    it('shows a loading indicator, even if no user is present', async () => {
      Meteor.user.returns(null);
      Meteor.userAsync.resolves(null);
      const { container } = render(
        <Router>
          <UserProvider>
            <I18nextProvider i18n={i18n}>
              <Loading />
            </I18nextProvider>
          </UserProvider>
        </Router>,
      );
      expect(container.getElementsByClassName('MuiCircularProgress-indeterminate')).to.have.lengthOf(1);
    });
  });
}
