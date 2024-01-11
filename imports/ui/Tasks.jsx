/**
 * Home page
 *
 * @locus Client
 * @module imports/ui/Home
 */
import React from 'react';
import { Box } from '@mui/material';
import { Datatable } from 'meteor/bratelefant:auto-methods/client';
import TasksAutoCollection from '../api/tasks.collection';
/**
 * @function Tasks
 * @description Rendes Tasks
 * @returns {JSX.Element} - Tasks
 */
function Tasks() {
  return (
    <Box sx={{ flexGrow: 1 }} id="home">
      <Datatable autoCollection={TasksAutoCollection} />
    </Box>
  );
}

export default Tasks;
