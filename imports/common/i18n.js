import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';
import ServerBackend from 'i18next-fs-backend';

if (Meteor.isClient) {
  i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(Backend)
    .init({
      debug: Meteor.isDevelopment,
      fallbackLng: Meteor.settings.public.defaultLanguage,
      interpolation: {
        escapeValue: false,
      },
      backend: {
        loadPath: '/locales/{{lng}}/{{ns}}.json',
      },
    });
}

if (Meteor.isServer) {
  i18n.use(ServerBackend).init({
    debug: Meteor.isDevelopment,
    preload: Meteor.settings.public.languages,
    fallbackLng: Meteor.settings.public.defaultLanguage,
    saveMissing: Meteor.isDevelopment,
    backend: {
      loadPath: (lngs, namespace) => Assets.absoluteFilePath(`locales/${lngs}/${namespace}.json`),
      addPath: `${process.env.PWD}/private/locales/{{lng}}/{{ns}}.missing.json`,
    },
  });
}

export default i18n;
