//----------------------------------------------------------------------//
// created: 05/03/2026                                                  //
// updated: 05/03/2026                                                  //
// by     : suryamin                                                    //
// note   : tafe project assignment                                     //
// program: TrafficHazardDetailUI.tsx                                   //
// use    : unit test for TrafficHazardDetailUI.test.tsx                //
// npm    : --save-dev @testing-library/react-native --legacy-peer-deps //
//          --save-dev @types/jest                                      //
//          --save-dev babel-preset-expo                                //
//          --save-dev babel-jest                                       //
// run    : npx jest --clearCache                                       //
//          npm test                                                    //
//----------------------------------------------------------------------//

import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { useRoute } from "@react-navigation/native";
import { StorageService } from "../../services/storageService";
import { GeocodingService } from "../../services/geocodingService";
import { TrafficHazardDetail } from "../TrafficHazardDetailUI";

//------------//
//---mockup---//
//------------//
jest.mock("@react-navigation/native", () => ({
  useRoute: jest.fn(),
}));

jest.mock("../../services/storageService", () => ({
  StorageService: {
    loadHazard: jest.fn(),
    addHazard: jest.fn(),
  },
}));

jest.mock("../../services/geocodingService", () => ({
  GeocodingService: {
    fetchFullAddressApi: jest.fn(),
  },
}));

jest.mock("@expo/vector-icons", () => {
  const React = require("react");
  const { Text } = require("react-native");
  return {
    MaterialIcons: ({ name }: { name: string }) =>
      React.createElement(Text, {}, name),
  };
});

describe("TrafficHazardDetail Component", () => {
  //--------------------//
  //---initialization---//
  //--------------------//
  const mockHazard = {
    id: 1,
    geometry: { coordinates: [151.2093, -33.8688] },
    properties: {
      mainCategory: "Traffic Incident",
      displayName: "Major Crash", // This is what renders if present
      CategoryIcon: "incident", // Matches your HazardTypeModel key
      roads: [{ suburb: "Sydney" }],
      adviceA: "Use alternative route",
      created: 1709600000000,
      lastUpdated: 1709610000000,
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRoute as jest.Mock).mockReturnValue({
      params: { hazard: mockHazard },
    });
    (StorageService.loadHazard as jest.Mock).mockResolvedValue([]);
    (GeocodingService.fetchFullAddressApi as jest.Mock).mockResolvedValue(
      "123 George St, Sydney",
    );
  });

  //---------------------------------//
  //---Test: TrafficHazardDetailUI---//
  //---------------------------------//
  it("renders hazard details correctly based on model labels", async () => {
    const { getByText } = render(<TrafficHazardDetail />);

    expect(getByText(/SYDNEY/)).toBeTruthy();

    expect(getByText(/Major Crash/)).toBeTruthy();

    expect(getByText("Use alternative route")).toBeTruthy();

    await waitFor(() => {
      expect(getByText("123 George St, Sydney")).toBeTruthy();
    });
  });

  it("handles saving the hazard", async () => {
    (StorageService.addHazard as jest.Mock).mockResolvedValue([mockHazard]);

    const { getByText } = render(<TrafficHazardDetail />);

    // Find the icon mock by its name 'save'
    const saveBtn = getByText("save");
    fireEvent.press(saveBtn);

    await waitFor(() => {
      expect(StorageService.addHazard).toHaveBeenCalled();
    });
  });

  it("falls back to mainCategory when displayName is missing", () => {
    const hazardNoDisplay = {
      ...mockHazard,
      properties: {
        ...mockHazard.properties,
        displayName: "", // Clear displayName
        mainCategory: "Traffic Incident",
      },
    };
    (useRoute as jest.Mock).mockReturnValue({
      params: { hazard: hazardNoDisplay },
    });

    const { getByText } = render(<TrafficHazardDetail />);

    // Now it should show the label from your HazardTypeMap
    expect(getByText(/Traffic Incident/)).toBeTruthy();
  });

  it("correctly handles missing suburb gracefully", () => {
    const hazardNoSuburb = {
      ...mockHazard,
      properties: { ...mockHazard.properties, roads: [] },
    };
    (useRoute as jest.Mock).mockReturnValue({
      params: { hazard: hazardNoSuburb },
    });

    const { queryByText, getAllByText } = render(<TrafficHazardDetail />);

    expect(queryByText(/SYDNEY/)).toBeNull();

    // FIX 2: If multiple elements exist, use getAllByText and check the length
    expect(getAllByText(/Major Crash/).length).toBeGreaterThan(0);
  });
});
