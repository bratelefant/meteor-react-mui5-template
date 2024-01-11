// Import Tinytest from the tinytest Meteor package.
import { Tinytest } from "meteor/tinytest";

// Import and rename a variable exported by auto-methods.js.
import { name as packageName } from "meteor/bratelefant:auto-methods";

// Write your tests here!
// Here is an example.
Tinytest.add('auto-methods - example', function (test) {
  test.equal(packageName, "auto-methods");
});
