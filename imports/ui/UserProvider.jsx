import React, { createContext, useContext } from "react";
import { useTracker } from "meteor/react-meteor-data";
import { Meteor } from "meteor/meteor";

// Erstellen Sie den UserContext
export const UserContext = createContext(null);

// Erstellen Sie den UserProvider
export const UserProvider = ({ children }) => {
  const user = useTracker(() => Meteor.user(), []);

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

// Erstellen Sie einen benutzerdefinierten Hook, um den aktuellen Benutzer abzurufen
export const useCurrentUser = () => useContext(UserContext);
