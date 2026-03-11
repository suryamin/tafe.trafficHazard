//---------------------------------------------------//
// created: 05/03/2026                               //
// updated: 05/03/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: jest.setup.js                            //
// use    : test runner                              //
// npm    : react-native-gesture-handler             //
//---------------------------------------------------//

import "react-native-gesture-handler/jestSetup";

// Mock AsyncStorage (Essential for your StorageService)
jest.mock("@react-native-async-storage/async-storage", () =>
  require("@react-native-async-storage/async-storage/jest/async-storage-mock"),
);

// Mocking the Alert module specifically
jest.mock("react-native/Libraries/Alert/Alert", () => ({
  alert: jest.fn(),
}));

// Optional: Silence certain logs that clutter test output
jest.spyOn(console, "log").mockImplementation(() => {});
jest.spyOn(console, "error").mockImplementation(() => {});

// This prevents the "Cannot find module 'expo-asset'" error
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  // We return a simple Text component that just renders the icon name
  return {
    MaterialIcons: ({ name, ...props }) =>
      React.createElement(Text, props, name),
    Ionicons: ({ name, ...props }) => React.createElement(Text, props, name),
    // Add any other icon sets you use here
  };
});
