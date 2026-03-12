//----------------------------------------------------------------------//
// created: 05/03/2026                                                  //
// updated: 05/03/2026                                                  //
// by     : suryamin                                                    //
// note   : tafe project assignment                                     //
// program: HomeUI.tsx                                                  //
// use    : unit test for HomeUI.test.tsx                               //
// npm    : --save-dev @testing-library/react-native --legacy-peer-deps //
//          --save-dev @types/jest                                      //
//          --save-dev babel-preset-expo                                //
//          --save-dev babel-jest                                       //
// run    : npx jest --clearCache                                       //
//          npm test                                                    //
//----------------------------------------------------------------------//
import React, { ReactNode } from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { Alert } from "react-native";
import "react-native-gesture-handler/jestSetup";
import { HomeScreen } from "../HomeUI";
import { StorageService } from "../services/storageService";
import { NswTransportService } from "../services/nswTransportService";

//------------//
//---mockup---//
//------------//

// --- 1. REACT NATIVE STUB MOCK ---
// This prevents DevMenu errors and ensures Alert.alert is a valid Jest function
jest.mock("react-native", () => {
  const React = require("react");
  return {
    View: (props: any) => React.createElement("View", props),
    Text: (props: any) => React.createElement("Text", props),
    TouchableOpacity: (props: any) =>
      React.createElement("TouchableOpacity", props),
    ActivityIndicator: (props: any) =>
      React.createElement("ActivityIndicator", props),
    ScrollView: (props: any) => React.createElement("ScrollView", props),
    StyleSheet: {
      create: (styles: any) => styles,
      flatten: (style: any) => style,
    },
    // ADD THIS: Dimensions fix
    Dimensions: {
      get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
    },
    Alert: {
      alert: jest.fn(),
    },
    Platform: {
      OS: "ios",
      select: (obj: any) => obj.ios || obj.default,
    },
  };
});

// --- 2. NAVIGATION MOCK ---
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => {
  const React = require("react");
  return {
    useNavigation: () => ({ navigate: mockNavigate }),
    useFocusEffect: (callback: any) => React.useEffect(callback, []),
  };
});

// --- 3. EXPO ICONS MOCK ---
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  return {
    MaterialIcons: (props: any) =>
      React.createElement("Text", props, props.name),
  };
});

// --- 4. SERVICE MOCKS ---
jest.mock("../services/storageService", () => ({
  StorageService: {
    loadHazard: jest.fn(),
    clearAll: jest.fn(),
  },
}));

jest.mock("../services/nswTransportService", () => ({
  NswTransportService: {
    fetchTrafficHazardApi: jest.fn(),
  },
}));

// --- 5. DROPDOWN PICKER MOCK ---
jest.mock("react-native-dropdown-picker", () => {
  const React = require("react");
  return (props: any) => React.createElement("View", { testID: "dropdown" });
});

// --- 6. DATE TIME PICKER MOCK ---
jest.mock("react-native-safe-area-context", () => {
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    // Define the type for children here
    SafeAreaProvider: ({ children }: { children: ReactNode }) => children,
    SafeAreaConsumer: (
      { children }: { children: (insets: typeof inset) => ReactNode },
    ) => children(inset),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    initialWindowMetrics: {
      fallback: false,
      frame: { x: 0, y: 0, width: 390, height: 844 },
      insets: inset,
    },
  };
});

// --- 7. Mock for react-native-paper-dates
jest.mock("react-native-paper-dates", () => ({
  DatePickerModal: () => null,
  registerTranslation: jest.fn(),
  en: {},
}));

// ---8. mock PaperProvider
jest.mock("react-native-paper", () => {
  const React = require("react");
  return {
    // Mock the Provider as a simple View
    PaperProvider: ({ children }: { children: React.ReactNode }) =>
      React.createElement("View", { testID: "paper-provider" }, children),

    // Mock the Button so it still renders its text
    Button: ({ children, onPress, style }: any) =>
      React.createElement(
        "TouchableOpacity",
        { onPress, style, testID: "paper-button" },
        children,
      ),

    // If you use other Paper components, add them here as simple Views
    Portal: ({ children }: any) => children,
    Modal: ({ children }: any) => children,
  };
});

describe("HomeScreen", () => {
  //--------------------//
  //---initialization---//
  //--------------------//
  beforeEach(() => {
    jest.clearAllMocks();
    (StorageService.loadHazard as jest.Mock).mockResolvedValue([]);
  });

  //------------------//
  //---Test: HomeUI---//
  //------------------//
  it("navigates to HazardList when hazards are found via API", async () => {
    const mockApiData = [{ id: 101, properties: { headline: "Test Hazard" } }];
    (NswTransportService.fetchTrafficHazardApi as jest.Mock).mockResolvedValue(
      mockApiData,
    );

    const { getByText } = render(<HomeScreen />);

    const submitBtn = getByText("Check Hazards");
    fireEvent.press(submitBtn);

    await waitFor(() => {
      // Should not show error alert on success
      expect(Alert.alert).not.toHaveBeenCalled();
      expect(NswTransportService.fetchTrafficHazardApi).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(
        "HazardList",
        expect.objectContaining({
          hazards: mockApiData,
          fromStorage: false,
        }),
      );
    });
  });

  it("shows an alert if the API returns no hazards", async () => {
    // Mock API returning empty list
    (NswTransportService.fetchTrafficHazardApi as jest.Mock).mockResolvedValue(
      [],
    );

    const { getByText } = render(<HomeScreen />);

    const submitBtn = getByText("Check Hazards");
    fireEvent.press(submitBtn);

    await waitFor(() => {
      // Alert should be called with "No Data"
      expect(Alert.alert).toHaveBeenCalledWith(
        "No Data",
        expect.stringContaining("hazards found"),
      );
    });
  });

  it("handles clearing storage and updates the UI", async () => {
    (StorageService.clearAll as jest.Mock).mockResolvedValue(undefined);
    (StorageService.loadHazard as jest.Mock).mockResolvedValue([]);

    const { getByText } = render(<HomeScreen />);

    // Update this to match your real UI text
    const clearBtn = getByText("Clear my incident");
    fireEvent.press(clearBtn);

    await waitFor(() => {
      expect(StorageService.clearAll).toHaveBeenCalled();
    });
  });
});
