//----------------------------------------------------------------------//
// created: 05/03/2026                                                  //
// updated: 05/03/2026                                                  //
// by     : suryamin                                                    //
// note   : tafe project assignment                                     //
// program: TrafficHazardListUI.tsx                                     //
// use    : unit test for TrafficHazardListUI.test.tsx                  //
// npm    : --save-dev @testing-library/react-native --legacy-peer-deps //
//          --save-dev @types/jest                                      //
//          --save-dev babel-preset-expo                                //
//          --save-dev babel-jest                                       //
// run    : npx jest --clearCache                                       //
//          npm test                                                    //
//----------------------------------------------------------------------//

import { useNavigation, useRoute } from "@react-navigation/native";
import { TrafficHazardList } from "../TrafficHazardListUI";
import { StorageService } from "../../services/storageService";
import { render, fireEvent, waitFor } from "@testing-library/react-native";

//------------//
//---mockup---//
//------------//

// Mock Navigation
jest.mock("@react-navigation/native", () => ({
  useNavigation: jest.fn(),
  useRoute: jest.fn(),
}));

// Mock StorageService
jest.mock("../../services/storageService", () => ({
  StorageService: {
    deleteHazard: jest.fn(),
  },
}));

// Mock Expo Icons to avoid native module errors
jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    // This makes the icon name searchable as text
    MaterialIcons: ({ name }: { name: string }) =>
      React.createElement(Text, {}, name),
  };
});

describe("TrafficHazardList Component", () => {
  //--------------------//
  //---initialization---//
  //--------------------//
  const mockNavigate = jest.fn();

  // Create a realistic mock hazard object
  const mockHazards = [
    {
      id: 123, // Number as per your handleDelete(id: number)
      properties: {
        mainCategory: "Incident",
        CategoryIcon: "Crash",
        roads: [{ suburb: "Sydney" }],
        adviceA: "Expect delays",
        locationQualifier: "Near",
      },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Default setup for navigation mocks
    (useNavigation as jest.Mock).mockReturnValue({ navigate: mockNavigate });
    (useRoute as jest.Mock).mockReturnValue({
      params: { hazards: mockHazards, fromStorage: false },
    });
  });

  //-------------------------------//
  //---Test: TrafficHazardListUI---//
  //-------------------------------//
  it('renders "No hazards found" when the hazard list is empty', () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { hazards: [], fromStorage: false },
    });

    const { getByText } = render(<TrafficHazardList />);
    expect(getByText("No hazards found.")).toBeTruthy();
  });

  it("renders hazard details correctly (suburb and advice)", () => {
    const { getByText } = render(<TrafficHazardList />);

    // Check if suburb renders (from props.roads[0].suburb)
    expect(getByText("Sydney")).toBeTruthy();
    // Check if advice renders
    expect(getByText("Expect delays")).toBeTruthy();
  });

  it("navigates to HazardDetail screen when an item is pressed", () => {
    const { getByText } = render(<TrafficHazardList />);

    // Simulate user tapping the hazard item
    fireEvent.press(getByText("Sydney"));

    expect(mockNavigate).toHaveBeenCalledWith("HazardDetail", {
      hazard: mockHazards[0],
    });
  });

  it("shows the delete button and updates list after deletion when in storage mode", async () => {
    (useRoute as jest.Mock).mockReturnValue({
      params: { hazards: mockHazards, fromStorage: true },
    });

    (StorageService.deleteHazard as jest.Mock).mockResolvedValue([]);

    // Destructure getByTestId here
    const { getByTestId, queryByText } = render(<TrafficHazardList />);

    // Use the testID we just added
    const deleteBtn = getByTestId("delete-button");
    fireEvent.press(deleteBtn);

    expect(StorageService.deleteHazard).toHaveBeenCalledWith(123);

    await waitFor(() => {
      expect(queryByText("Sydney")).toBeNull();
    });
  });
});
