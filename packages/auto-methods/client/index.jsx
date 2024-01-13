/**
 * @locus Client
 */
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import React from 'react';
import {
  Alert,
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, Snackbar, Typography,
} from '@mui/material';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import { DataGrid, GridActionsCellItem, GridToolbarContainer } from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import { AutoForm } from 'uniforms-mui';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

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
  const [deleteOpen, setDeleteOpen] = React.useState(undefined);
  const [error, setError] = React.useState(undefined);
  const loading = useSubscribe(`${autoCollection.collectionName}.all`);
  const data = useFind(() => autoCollection.collection.find({}, { limit: 100 }), []);

  const handleDeleteClick = async (id) => {
    await Meteor.callAsync(`${autoCollection.collectionName}.remove`, id);
    setDeleteOpen(undefined);
  };

  function confirmDelete() {
    return (
      <Dialog
        maxWidth="xs"
        open={!!deleteOpen}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          You will not be able to recover this record!
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>
            No
          </Button>
          <Button onClick={async () => handleDeleteClick(deleteOpen)}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  }
  return (
    <Box>
      {confirmDelete()}
      <DataGrid
        disableRowSelectionOnClick
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { bridge: autoCollection.bridge, autoCollection } }}
        rows={data}
        editMode="row"
        processRowUpdate={async (updateRow, { _id }) => {
          await Meteor.callAsync(`${autoCollection.collectionName}.update`, _id, { $set: updateRow });
          return updateRow;
        }}
        onProcessRowUpdateError={(err) => {
          setError(err?.reason);
        }}
        columns={[...autoCollection.columns(), {
          field: 'actions',
          type: 'actions',
          headerName: 'Actions',
          width: 100,
          cellClassName: 'actions',
          getActions: ({ id }) => [
            <GridActionsCellItem
              icon={<DeleteIcon />}
              label="Delete"
              onClick={() => setDeleteOpen(id)}
              color="secondary"
            />,
          ],
        }]}
        loading={loading()}
        getRowId={(row) => row._id}
      />
      <Snackbar
        open={!!error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={() => setError(undefined)}
      >
        <Alert onClose={() => setError(undefined)} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
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
