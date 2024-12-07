import React, { createContext, useState, useContext } from "react";

// Define the initial state
const initialState = {
  latitude: null,
  longitude: null,
  setLatitude: (value) => {},
  setLongitude: (value) => {},
};

// Create the context
const Context = createContext(initialState);

// Create the provider component
export const GlobalStateProvider = ({ children }) => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  return (
    <Context.Provider
      value={{ latitude, setLatitude, longitude, setLongitude }}
    >
      {children}
    </Context.Provider>
  );
};

// Custom hook to use the global state
export const useGlobalState = () => useContext(Context);
