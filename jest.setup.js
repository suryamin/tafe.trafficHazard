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

// 1. Mock AsyncStorage
jest.mock(
  "@react-native-async-storage/async-storage",
  () =>
    require(
      "@react-native-async-storage/async-storage/jest/async-storage-mock",
    ),
);

// 2. UNIVERSAL ALERT MOCK (Fixes the "undefined reading alert" error)
jest.mock("react-native", () => {
  const RN = jest.requireActual("react-native");
  RN.Alert.alert = jest.fn();
  return RN;
});

// 3. Mock window.alert for the GitHub Web / browser branch
global.window = global.window || {};
global.window.alert = jest.fn();

// 4. Mock Icons (Fixes expo-asset errors)
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    MaterialIcons: ({ name, ...props }) =>
      React.createElement(Text, props, name),
    Ionicons: ({ name, ...props }) => React.createElement(Text, props, name),
    MaterialCommunityIcons: ({ name, ...props }) =>
      React.createElement(Text, props, name),
  };
});

// 5. Cleanup logs
jest.spyOn(console, "log").mockImplementation(() => {});
// Keep console.error enabled just in case something else breaks!
