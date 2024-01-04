import { UserSrv } from "./user.server";

Meteor.methods({
  async "user.signup"(email, language) {
    await UserSrv.signup(email, language);
  },
});
