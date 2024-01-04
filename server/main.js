import { Meteor } from "meteor/meteor";
import { UserSrv } from "../imports/api/user.server";
import "../imports/api/user.server.methods";

UserSrv.configureEmails();

Meteor.startup(async () => {
  Accounts.config({
    sendVerificationEmail: true,
    loginExpirationInDays: null,
  });
});
