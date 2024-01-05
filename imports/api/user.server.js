import i18n from '../common/i18n';

const UserSrv = {};

UserSrv.signup = async (email, language) => {
  await Accounts.createUserVerifyingEmail({ email, profile: { language } });
};

UserSrv.configureEmails = async () => {
  Accounts.emailTemplates.siteName = Meteor.settings.systemMail.siteName;
  Accounts.emailTemplates.from = Meteor.settings.systemMail.from;

  Accounts.urls.resetPassword = function reset(token) {
    return Meteor.absoluteUrl(`reset-password/${token}`);
  };

  Accounts.urls.enrollAccount = function enroll(token) {
    return Meteor.absoluteUrl(`enroll/${token}`);
  };

  Accounts.emailTemplates.enrollAccount = {
    subject(user) {
      return i18n.t('mail.enroll.subject', {
        lng: user?.profile?.language || Meteor.settings.public.defaultLanguage,
        appName: Meteor.settings.public.name,
      });
    },
    text(user, url) {
      return i18n.t('mail.enroll.body', {
        lng: user?.profile?.language || Meteor.settings.public.defaultLanguage,
        appName: Meteor.settings.public.name,
        user,
        url,
      });
    },
  };

  Accounts.emailTemplates.resetPassword = {
    subject(user) {
      return i18n.t('mail.resetPassword.subject', {
        lng: user?.profile?.language || Meteor.settings.public.defaultLanguage,
        appName: Meteor.settings.public.name,
      });
    },
    text(user, url) {
      return i18n.t('mail.resetPassword.body', {
        lng: user?.profile?.language || Meteor.settings.public.defaultLanguage,
        appName: Meteor.settings.public.name,
        user,
        url,
      });
    },
  };
};

export default UserSrv;
