import React from "react";
import { Typography, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

export const Welcome = () => {
  const { t, i18n } = useTranslation(["Welcome"]);
  return (
    <Stack spacing={1} alignItems={"center"}>
      <Typography variant="h2" color="text.secondary">
        {t("headline")}
      </Typography>
    </Stack>
  );
};
