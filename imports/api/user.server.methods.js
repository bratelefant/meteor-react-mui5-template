import { UserSrv } from "./user.server";

Meteor.methods({
  async "user.signup"(email) {
    await UserSrv.signup(email);
  },
});
