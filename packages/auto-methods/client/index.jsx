/**
 * @locus Client
 */
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import React from 'react';
import {
  Box, Button, Dialog, DialogTitle, Typography,
} from '@mui/material';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import { AutoForm } from 'uniforms-mui';

checkNpmVersions({
  '@mui/icons-material': '^5.15.2',
  '@mui/material': '^5.15.2',
  '@mui/x-data-grid': '^6.18.7',
});

function EditToolbar({ bridge }) {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  return (
    <GridToolbarContainer>
      <Dialog open={open}>
        <DialogTitle>Insert</DialogTitle>
        <Box margin={4}>
          <AutoForm schema={bridge} />
        </Box>
      </Dialog>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>Add Record</Button>
    </GridToolbarContainer>
  );
}

export function Datatable({ autoCollection }) {
  const loading = useSubscribe(`${autoCollection.collectionName}.all`);
  const data = useFind(() => autoCollection.collection.find({}, { limit: 100 }), []);

  return (
    <Box>
      <DataGrid
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { bridge: autoCollection.bridge } }}
        rows={data}
        columns={autoCollection.columns()}
        loading={loading()}
        getRowId={(row) => row._id}
      />
    </Box>
  );
}

Datatable.propTypes = {
  autoCollection: PropTypes.object.isRequired,
};

export function CollectionName({ autoCollection }) {
  return (
    <Typography variant="h6">
      {autoCollection.collectionName}
    </Typography>
  );
}

CollectionName.propTypes = {
  autoCollection: PropTypes.object.isRequired,
};
