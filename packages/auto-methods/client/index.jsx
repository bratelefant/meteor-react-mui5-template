/**
 * @locus Client
 */
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import React from 'react';
import {
  Box, Button, Dialog, DialogTitle, Typography,
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
  const loading = useSubscribe(`${autoCollection.collectionName}.all`);
  const data = useFind(() => autoCollection.collection.find({}, { limit: 100 }), []);

  const handleDeleteClick = (id) => () => {
    Meteor.callAsync(`${autoCollection.collectionName}.remove`, id);
  };

  return (
    <Box>
      <DataGrid
        disableRowSelectionOnClick
        slots={{ toolbar: EditToolbar }}
        slotProps={{ toolbar: { bridge: autoCollection.bridge, autoCollection } }}
        rows={data}
        editMode="row"
        processRowUpdate={(updateRow, { _id }) => {
          Meteor.callAsync(`${autoCollection.collectionName}.update`, _id, { $set: updateRow });
          return updateRow;
        }}
        onProcessRowUpdateError={(error) => console.log(error)}
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
              onClick={handleDeleteClick(id)}
              color="inherit"
            />,
          ],
        }]}
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
