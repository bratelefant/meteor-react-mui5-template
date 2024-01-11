import { Meteor } from 'meteor/meteor';
import UserSrv from '../imports/api/user.server';
import '../imports/api/user.server.methods';
import '../imports/api/tasks.server';

UserSrv.configureEmails();

Meteor.startup(async () => {
  Accounts.config({
    sendVerificationEmail: true,
    loginExpirationInDays: null,
  });
});
