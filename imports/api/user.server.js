/**
 * @locus server
 * @summary User API
 * @description Meteor server functions related to user
 */
import i18n from '../common/i18n';

const UserSrv = {};

/**
 * @locus server
 * @summary Create a new user
 * @function signup
 * @public
 * @memberof UserSrv
 * @param {string} email - User email
 * @param {string} language - User language
 */
UserSrv.signup = async (email, language) => {
  await Accounts.createUserVerifyingEmail({ email, profile: { language } });
};

/**
 * @summary Setup mail templates
 * @function configureEmails
 * @memberof UserSrv
 * @public
 * @description Setup mail templates for resetting password and enrolling accounts. This
 * is fully i18n compatible, and will use the user's language if available (via profile.language),
 * or the default to Meteor.settings.public.defaultLanguage.
 * At the moment, verify email is not supported, as we use enrollment via a verifiee email instead
 * and multiple mails or changing the users email is not supported yet.
 * @see {@link https://docs.meteor.com/api/accounts-multi.html#Accounts-emailTemplates}
 * @see {@link https://docs.meteor.com/api/accounts-multi.html#Accounts-urls}
 */
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

/**
 * @locus server
 * @summary User server functions
 * @namespace UserSrv
 */
export default UserSrv;
