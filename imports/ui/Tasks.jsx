/**
 * Home page
 *
 * @locus Client
 * @module imports/ui/Home
 */
import React from 'react';
import { Box, Container } from '@mui/material';
import { Datatable } from 'meteor/bratelefant:mrm-auto-collections/client';
import TasksAutoCollection from '../api/tasks.collection';
import i18n from '../common/i18n';
/**
 * @function Tasks
 * @description Rendes Tasks
 * @returns {JSX.Element} - Tasks
 */
function Tasks() {
  if (!i18n.isInitialized) {
    return null;
  }
  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1 }} padding={2}>
        <Datatable autoCollection={TasksAutoCollection} />
      </Box>
    </Container>
  );
}

export default Tasks;
