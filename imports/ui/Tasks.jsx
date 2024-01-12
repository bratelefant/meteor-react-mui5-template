/**
 * Home page
 *
 * @locus Client
 * @module imports/ui/Home
 */
import React from 'react';
import { Box, Container } from '@mui/material';
import { Datatable } from 'meteor/bratelefant:auto-methods/client';
import TasksAutoCollection from '../api/tasks.collection';
/**
 * @function Tasks
 * @description Rendes Tasks
 * @returns {JSX.Element} - Tasks
 */
function Tasks() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ flexGrow: 1 }} padding={2}>
        <Datatable autoCollection={TasksAutoCollection} />
      </Box>
    </Container>
  );
}

export default Tasks;
