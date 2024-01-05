/**
 * @module UserProvider
 */
import React, { createContext, useContext } from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import PropTypes from 'prop-types';

export const UserContext = createContext(null);

/**
 * Provides the current user to the child components.
 *
 * @param {Object} props - The component props.
 * @param {ReactNode} props.children - The child components.
 * @returns {ReactNode} The component with the user context provider.
 */
export function UserProvider({ children }) {
  const user = useTracker(() => Meteor.user(), []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
}

UserProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCurrentUser = () => useContext(UserContext);
