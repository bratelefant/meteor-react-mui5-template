import React from 'react';
import { Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

function Welcome() {
  const { t } = useTranslation(['Welcome']);
  return (
    <Stack spacing={1} alignItems="center">
      <Typography variant="h2" color="text.secondary">
        {t('headline', { appName: Meteor.settings.public.name })}
      </Typography>
    </Stack>
  );
}

export default Welcome;
