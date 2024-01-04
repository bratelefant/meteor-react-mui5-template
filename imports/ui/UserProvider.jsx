import React, { createContext, useContext } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const user = useTracker(() => Meteor.user(), []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useCurrentUser = () => useContext(UserContext);
