/* eslint-disable react/jsx-props-no-spreading */
/**
 * @locus Client
 */
import { checkNpmVersions } from 'meteor/tmeasday:check-npm-versions';
import React, { useCallback, useRef } from 'react';
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
import {
  AutoForm,
  AutoFields,
  AutoField,
  ErrorsField,
  SubmitField,
} from 'uniforms-mui';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import { useTranslation } from 'react-i18next';
import { useForm } from 'uniforms';

checkNpmVersions({
  '@mui/icons-material': '^5.15.2',
  '@mui/material': '^5.15.2',
  '@mui/x-data-grid': '^6.18.7',
});

function CustomAutoField({ label, ...props }) {
  const { t } = useTranslation(['bratelefant_mrm-auto-collections']);

  // Übersetzen Sie das Label basierend auf dem Namen des Feldes
  const newLabel = t(`column.${label}`);

  return <AutoField {...props} label={newLabel} />;
}

function CustomAutoFields() {
  const { schema } = useForm();
  return (
    <div>
      {schema.getSubfields().map((fieldName) => (
        <CustomAutoField
          key={fieldName}
          name={fieldName}
          {...schema.getField(fieldName)}
        />
      ))}
    </div>
  );
}

function EditToolbar({ bridge, autoCollection }) {
  const { t, i18n } = useTranslation(['bratelefant_mrm-auto-collections']);
  if (autoCollection.locales) {
    Object.entries(autoCollection.locales).forEach(([key, value]) => {
      i18n.addResourceBundle(key, 'bratelefant_mrm-auto-collections', value);
    });
  }

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
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="xs">
        <AutoForm ref={ref} schema={bridge} onSubmit={onSubmit}>
          <DialogTitle>{t('InsertModal.title')}</DialogTitle>
          <DialogContent dividers>

            <AutoFields />
            <ErrorsField />

          </DialogContent>
          <DialogActions>
            <FormControlLabel
              sx={{ flexGrow: 1 }}
              control={<Switch checked={keepOpen} onChange={toggleKeepOpen} />}
              label={t('InsertModal.keepOpen')}
            />
            <Button onClick={() => setOpen(false)}>
              {t('InsertModal.cancel')}
            </Button>
            <SubmitField label={t('InsertModal.submit')} />
          </DialogActions>
        </AutoForm>
      </Dialog>

      <Button
        color="primary"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleClick}
      >
        {t('Datatable.addRecord')}
      </Button>
      <GridToolbar />
    </GridToolbarContainer>
  );
}

EditToolbar.propTypes = {
  bridge: PropTypes.shape({}).isRequired,
  autoCollection: PropTypes.shape({
    collectionName: PropTypes.string.isRequired,
    locales: PropTypes.shape({}),
  }).isRequired,
};

export function Datatable({ autoCollection, cursorKey = 'default' }) {
  const cursorDef = autoCollection.cursors[cursorKey];
  const [deleteOpen, setDeleteOpen] = React.useState(undefined);
  const { t } = useTranslation(['bratelefant_mrm-auto-collections']);
  const [error, setError] = React.useState(undefined);
  const loading = useSubscribe(`${autoCollection.collectionName}.${cursorKey}`);
  const data = useFind(
    () => autoCollection.collection.find(cursorDef.sel(), cursorDef.opt()),
    [],
  );

  const handleDeleteClick = useCallback(
    async (id) => {
      await Meteor.callAsync(`${autoCollection.collectionName}.remove`, id);
      setDeleteOpen(undefined);
    },
    [autoCollection.collectionName],
  );

  const confirmDelete = useCallback(
    () => (
      <Dialog maxWidth="xs" open={!!deleteOpen}>
        <DialogTitle>{t('DeleteModal.title')}</DialogTitle>
        <DialogContent dividers>{t('DeleteModal.message')}</DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteOpen(false)}>
            {t('DeleteModal.no')}
          </Button>
          <Button
            type="submit"
            onClick={async () => handleDeleteClick(deleteOpen)}
          >
            {t('DeleteModal.yes')}
          </Button>
        </DialogActions>
      </Dialog>
    ),
    [deleteOpen, handleDeleteClick, t],
  );

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
            headerName: t('Datatable.actions'),
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
    locales: PropTypes.shape({}),
    cursors: PropTypes.shape({
      default: PropTypes.shape({
        sel: PropTypes.func,
        opt: PropTypes.func,
      }),
    }).isRequired,
    columns: PropTypes.func.isRequired,
    bridge: PropTypes.shape({}).isRequired,
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
    locales: PropTypes.shape({}),
  }).isRequired,
};
