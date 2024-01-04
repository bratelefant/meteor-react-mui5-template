export const UserSrv = {};

UserSrv.signup = async function (email) {
  await Accounts.createUserVerifyingEmail({ email });
};

UserSrv.configureEmails = function () {
  Accounts.emailTemplates.siteName = Meteor.settings.systemMail.siteName;
  Accounts.emailTemplates.from = Meteor.settings.systemMail.from;

  Accounts.urls.resetPassword = function reset(token) {
    return Meteor.absoluteUrl("reset-password/" + token);
  };

  Accounts.urls.enrollAccount = function enroll(token) {
    return Meteor.absoluteUrl("enroll/" + token);
  };
};
