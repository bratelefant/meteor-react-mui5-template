import { expect } from "chai";
import sinon from "sinon";
import { Accounts } from "meteor/accounts-base";
import { Meteor } from "meteor/meteor";
import { UserSrv } from "../imports/api/user.server";
import i18n from "../imports/common/i18n";

if (Meteor.isServer) {
  describe("UserSrv", function () {
    afterEach(function () {
      sinon.restore();
    });

    describe("signup", function () {
      it("should call Accounts.createUserVerifyingEmail with correct parameters", async function () {
        const createUserVerifyingEmailStub = sinon.stub(
          Accounts,
          "createUserVerifyingEmail"
        );

        const email = "test@example.com";
        const language = "en";

        await UserSrv.signup(email, language);

        expect(
          createUserVerifyingEmailStub.calledOnceWith({
            email,
            profile: { language },
          })
        ).to.be.true;
      });
    });

    describe("configureEmails", function () {
      it("should correctly configure Accounts.emailTemplates", function () {
        const settingsStub = sinon.stub(Meteor, "settings").value({
          systemMail: {
            siteName: "Test Site",
            from: "test@example.com",
          },
          public: {
            defaultLanguage: "en",
            name: "Test App",
          },
        });

        UserSrv.configureEmails();

        expect(Accounts.emailTemplates.siteName).to.equal("Test Site");
        expect(Accounts.emailTemplates.from).to.equal("test@example.com");
        expect(
          Accounts.emailTemplates.enrollAccount.subject({
            profile: { language: "en" },
          })
        ).to.equal(
          i18n.t("mail.enroll.subject", { lng: "en", appName: "Test App" })
        );
        expect(
          Accounts.emailTemplates.resetPassword.subject({
            profile: { language: "en" },
          })
        ).to.equal(
          i18n.t("mail.resetPassword.subject", {
            lng: "en",
            appName: "Test App",
          })
        );
      });
    });
  });
}
