Package.describe({
  name: 'bratelefant:auto-methods',
  version: '0.0.1',
  // Brief, one-line summary of the package.
  summary: 'Automatically create Meteor methods for your collections, based on SimpleSchema definitions.',
  // URL to the Git repository containing the source code for this package.
  git: '',
  // By default, Meteor will default to using README.md for documentation.
  // To avoid submitting documentation, set this field to null.
  documentation: 'README.md',
});

Package.onUse((api) => {
  api.versionsFrom('2.14');
  api.use('ecmascript');
  api.use('aldeed:collection2');
  api.mainModule('auto-methods.js');
});

Package.onTest((api) => {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('bratelefant:auto-methods');
  api.mainModule('auto-methods-tests.js');
});

Npm.depends({ 'simpl-schema': '3.4.1' });
