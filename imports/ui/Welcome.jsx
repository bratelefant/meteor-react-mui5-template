/**
 * A welcome message.
 *
 * @locus Client
 * @module imports/ui/Welcome
 */
import React from 'react';
import { Typography, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';

/**
 * Welcome is a functional component that displays a welcome message.
 * The message is internationalized using the react-i18next library.
 *
 * @function Welcome
 * @description A welcome message.
 * @returns {React.Element} A Stack component from Material UI containing a Typography component.
 */
function Welcome() {
  const { t } = useTranslation();

  return (
    <Stack spacing={1} alignItems="center">
      <Typography variant="h2" color="text.secondary">
        {t('Welcome.headline', { appName: Meteor.settings.public.name })}
      </Typography>
    </Stack>
  );
}

export default Welcome;
