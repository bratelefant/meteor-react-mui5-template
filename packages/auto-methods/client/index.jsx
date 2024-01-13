/**
 * @locus Client
 */
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import React, { useRef } from 'react';
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Snackbar,
  Switch,
  Typography,
} from '@mui/material';
import { useFind, useSubscribe } from 'meteor/react-meteor-data';
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbar,
  GridToolbarContainer,
} from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import AddIcon from '@mui/icons-material/Add';
import { AutoForm } from 'uniforms-mui';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useTranslation } from 'react-i18next';

checkNpmVersions({
  '@mui/icons-material': '^5.15.2',
  '@mui/material': '^5.15.2',
  '@mui/x-data-grid': '^6.18.7',
});

function EditToolbar({ bridge, autoCollection }) {
  const { t } = useTranslation('bratelefant_auto-methods');
  const [open, setOpen] = React.useState(false);
  const ref = useRef();
  const [keepOpen, setKeepOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  const toggleKeepOpen = () => {
    setKeepOpen((prevKeepOpen) => !prevKeepOpen);
  };

  const onSubmit = async (model) => {
    await Meteor.callAsync(`${autoCollection.collectionName}.insert`, model);
    if (!keepOpen) {
      setOpen(false);
    } else {
      ref.current.reset();
    }
  };

  return (
    <GridToolbarContainer sx={{ alignItems: 'flex-end' }}>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Insert</DialogTitle>
        <DialogContent>
          <AutoForm ref={ref} schema={bridge} onSubmit={onSubmit} />
        </DialogContent>
        <DialogActions>
          <FormControlLabel
            control={<Switch checked={keepOpen} onChange={toggleKeepOpen} />}
            label="Keep dialog open"
          />
        </DialogActions>
      </Dialog>
      <Button
        color="primary"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleClick}
      >
        {t('autoCollection.addRecord')}
      </Button>
      <GridToolbar />
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  bridge: PropTypes.shape({}).isRequired,
  autoCollection: PropTypes.shape({ collectionName: PropTypes.string.isRequired }).isRequired,
};

export function Datatable({ autoCollection, cursorKey = 'default' }) {
  const cursorDef = autoCollection.cursors[cursorKey];
  const [deleteOpen, setDeleteOpen] = React.useState(undefined);
  const [error, setError] = React.useState(undefined);
  const loading = useSubscribe(`${autoCollection.collectionName}.${cursorKey}`);
  const data = useFind(
    () => autoCollection.collection.find(cursorDef.sel(), cursorDef.opt()),
    [],
  );

  const handleDeleteClick = async (id) => {
    await Meteor.callAsync(`${autoCollection.collectionName}.remove`, id);
    setDeleteOpen(undefined);
  };

  function confirmDelete() {
    return (
      <Dialog maxWidth="xs" open={!!deleteOpen}>
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          You will not be able to recover this record!
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>No</Button>
          <Button
            type="submit"
            onClick={async () => handleDeleteClick(deleteOpen)}
          >
            Yes
          </Button>
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
        slotProps={{
          toolbar: { bridge: autoCollection.bridge, autoCollection },
        }}
        rows={data}
        editMode="row"
        processRowUpdate={async (updateRow, { _id }) => {
          await Meteor.callAsync(
            `${autoCollection.collectionName}.update`,
            _id,
            { $set: updateRow },
          );
          return updateRow;
        }}
        onProcessRowUpdateError={(err) => {
          setError(err?.reason);
        }}
        columns={[
          ...autoCollection.columns(),
          {
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
          },
        ]}
        loading={loading()}
        getRowId={(row) => row._id}
      />
      <Snackbar
        open={!!error}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        autoHideDuration={6000}
        onClose={() => setError(undefined)}
      >
        <Alert
          onClose={() => setError(undefined)}
          severity="error"
          sx={{ width: '100%' }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
}

Datatable.propTypes = {
  autoCollection: PropTypes.shape({
    collectionName: PropTypes.string.isRequired,
    policyChecks: PropTypes.shape({
      insert: PropTypes.func,
      update: PropTypes.func,
      remove: PropTypes.func,
    }).isRequired,
    collection: PropTypes.shape({
      find: PropTypes.func,
    }).isRequired,
    cursors: PropTypes.shape({
      default: PropTypes.shape({
        sel: PropTypes.func,
        opt: PropTypes.func,
      }),
    }).isRequired,
    columns: PropTypes.func.isRequired,
    bridge: PropTypes.shape({
    }).isRequired,
    schema: PropTypes.shape({}).isRequired,
    metaSchema: PropTypes.shape({}).isRequired,
  }).isRequired,
  cursorKey: PropTypes.string,
};

Datatable.defaultProps = {
  cursorKey: 'default',
};

export function CollectionName({ autoCollection }) {
  return <Typography variant="h6">{autoCollection.collectionName}</Typography>;
}

CollectionName.propTypes = {
  autoCollection: PropTypes.shape({
    collectionName: PropTypes.string.isRequired,
  }).isRequired,
};
