/**
 * Loading component.
 *
 * @locus Client
 * @module imports/ui/Loading
 */
import React from 'react';
import { Backdrop, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

/**
 * @function Loading
 * @description React component that provides a loading indicator. For example, when a page is
 * loading due to loading i18n translations, using Suspense.
 * @param {Object} props - React props.
 * @param {boolean} props.open - Whether the loading indicator should be shown.
 * @returns {JSX.Element} - Loading
 */
function Loading({ open }) {
  return (
    <Backdrop
      role="alert"
      aria-busy="true"
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}

Loading.propTypes = {
  open: PropTypes.bool.isRequired,
};

export default Loading;
