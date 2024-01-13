Package.describe({
  name: 'bratelefant:mrm-auto-collections',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary:
    'Meteor-React-Mui-Package. Automatically create Meteor methods for your collections, based on SimpleSchema definitions.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('2.14');
  api.use('ecmascript');
  api.use('aldeed:collection2@3.5.0');
  api.use('tmeasday:check-npm-versions');
  api.use('react-meteor-data');
  api.mainModule('common/index.js', ['server', 'client']);
  api.addAssets('locales/de/translation.json', 'client');
  api.addAssets('locales/en/translation.json', 'client');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('bratelefant:auto-methods');
  api.mainModule('tests/index.js');
});
