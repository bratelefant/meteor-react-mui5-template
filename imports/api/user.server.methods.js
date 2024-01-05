import { check } from 'meteor/check';
import UserSrv from './user.server';

Meteor.methods({
  'user.signup': async (email, language) => {
    check(email, String);
    check(language, String);
    await UserSrv.signup(email, language);
  },
});
