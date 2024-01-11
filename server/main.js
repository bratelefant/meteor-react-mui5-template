import { Meteor } from 'meteor/meteor';
import UserSrv from '../imports/api/user.server';
import '../imports/api/user.server.methods';
import AutoMethods from 'meteor/bratelefant:auto-methods';
import Tasks from '../imports/api/tasks';

UserSrv.configureEmails();
AutoMethods.registerMethods([
  Tasks,
]);

Meteor.startup(async () => {
  Accounts.config({
    sendVerificationEmail: true,
    loginExpirationInDays: null,
  });
});
