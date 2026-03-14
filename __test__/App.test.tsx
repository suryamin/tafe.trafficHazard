//----------------------------------------------------------------------//
// created: 05/03/2026                                                  //
// updated: 05/03/2026                                                  //
// by     : suryamin                                                    //
// note   : tafe project assignment                                     //
// program: App.tsx                                                     //
// use    : unit test for App.test.tsx                                  //
// npm    : --save-dev @testing-library/react-native --legacy-peer-deps //
//          --save-dev @types/jest                                      //
//          --save-dev babel-preset-expo                                //
//          --save-dev babel-jest                                       //
// run    : npx jest --clearCache                                       //
//          npm test                                                    //
//----------------------------------------------------------------------//

import React from "react";
import { render, waitFor } from "@testing-library/react-native";
import App from "../App";

//------------//
//---mockup---//
//------------//

// 1. Mock the Screens
jest.mock("../HomeUI", () => {
  const { View, Text } = require("react-native");
  // Add props here to be safe
  return {
    HomeScreen: (props: any) => (
      <View>
        <Text>Mock Home Screen</Text>
      </View>
    ),
  };
});

jest.mock("../ui/TrafficHazardListUI", () => {
  const { View } = require("react-native");
  return { TrafficHazardList: () => <View /> };
});

jest.mock("../ui/TrafficHazardDetailUI", () => {
  const { View } = require("react-native");
  return { TrafficHazardDetail: () => <View /> };
});

// 2. Mock Navigation Native (This prevents native bridge issues)
jest.mock("@react-navigation/native-stack", () => {
  const React = require("react");
  const { View } = require("react-native");

  return {
    createNativeStackNavigator: jest.fn(() => ({
      // The Navigator just acts as a container
      Navigator: ({ children }: any) => <View>{children}</View>,
      // The Screen must render the 'component' prop it receives
      Screen: ({ component: Component, name }: any) => (
        <View testID={`screen-${name}`}>
          <Component
            route={{ params: {} }}
            navigation={{ navigate: jest.fn() }}
          />
        </View>
      ),
    })),
  };
});

// 3. Mock the Storage Service (because HomeUI might try to call it on mount)
jest.mock("../services/storageService", () => ({
  StorageService: {
    loadHazard: jest.fn().mockResolvedValue([]),
  },
}));

describe("App Navigation", () => {
  it("renders the Navigation Container and defaults to Home screen", async () => {
    // We use render to see if the app crashes on boot
    const { getByText } = render(<App />);

    // Since initialRouteName="Home", we should see our Mock Home Screen text
    await waitFor(() => {
      expect(getByText("Mock Home Screen")).toBeTruthy();
    });
  });
});
