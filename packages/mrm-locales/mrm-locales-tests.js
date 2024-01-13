// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by mrm-locales.js.
import { name as packageName } from "meteor/bratelefant:mrm-locales";

// Write your tests here!
// Here is an example.
Tinytest.add('mrm-locales - example', function (test) {
  test.equal(packageName, "mrm-locales");
});
