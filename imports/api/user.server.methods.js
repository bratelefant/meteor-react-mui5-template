/**
 * @namespace Methods
 * @summary Meteor methods for user management
 */
import { check } from 'meteor/check';
import UserSrv from './user.server';

Meteor.methods({
  /**
 * @summary Create a new user
 * @description This method is used to create a new user. It will send an email to the user
 * with a link to enroll the account.
 * @function 'user.signup' - Meteor method
 * @memberof Methods
 * @public
 * @param {string} email - User email
 * @param {string} language - User language
 */
  'user.signup': async (email, language) => {
    check(email, String);
    check(language, String);
    await UserSrv.signup(email, language);
  },
});
