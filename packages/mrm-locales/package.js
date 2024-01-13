Package.describe({
  name: 'bratelefant:mrm-locales',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Locales for Meteor React Mui',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('2.14');
  api.use('ecmascript');
  api.addAssets('locales/de/translation.json', 'client');
  api.addAssets('locales/en/translation.json', 'client');
  api.mainModule('mrm-locales.js');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('bratelefant:mrm-locales');
  api.mainModule('mrm-locales-tests.js');
});
