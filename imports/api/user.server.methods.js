import { UserSrv } from "./user.server";
import { check } from "meteor/check";

Meteor.methods({
  async "user.signup"(email, language) {
    check(email, String);
    check(language, String);
    await UserSrv.signup(email, language);
  },
});
