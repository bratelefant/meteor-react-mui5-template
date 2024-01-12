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

function EditToolbar({ bridge, autoCollection }) {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const onSubmit = async (model) => {
    await Meteor.callAsync(`${autoCollection.collectionName}.insert`, model);
    setOpen(false);
  };

  return (
    <GridToolbarContainer>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Insert</DialogTitle>
        <Box margin={4}>
          <AutoForm schema={bridge} onSubmit={onSubmit} />
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
        slotProps={{ toolbar: { bridge: autoCollection.bridge, autoCollection } }}
        rows={data}
        editMode="row"
        processRowUpdate={(updateRow, { _id }) => {
          console.log('updateRow', updateRow);
          console.log('originalRow', _id);
          console.log(autoCollection.columns());
          Meteor.callAsync(`${autoCollection.collectionName}.update`, _id, { $set: updateRow });
        }}
        onProcessRowUpdateError={(error) => console.log(error)}
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
