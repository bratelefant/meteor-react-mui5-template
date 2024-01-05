import React from "react";
import { render } from "@testing-library/react";
import { expect } from "chai";
import { Welcome } from "../../imports/ui/Welcome";
import { I18nextProvider } from "react-i18next";
import i18n from "../../imports/common/i18n";

if (Meteor.isClient)
  describe("<Welcome />", () => {
    beforeEach(async () => {
      await i18n.loadNamespaces("Welcome");
    });

    it("renders the headline", () => {
      const { getByText } = render(
        <I18nextProvider i18n={i18n}>
          <Welcome />
        </I18nextProvider>
      );

      expect(
        getByText(
          i18n.t("headline", {
            ns: "Welcome",
            appName: Meteor.settings.public.name,
          })
        )
      ).to.exist;
    });
  });
