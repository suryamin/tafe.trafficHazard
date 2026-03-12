//---------------------------------------------------//
// created: 05/03/2026                               //
// updated: 06/03/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: nswTransportService.test.ts              //
// use    : unit test for nswTransportService.ts     //
// npm    : --save-dev @types/jest                   //
//          --save-dev babel-preset-expo             //
//          --save-dev babel-jest                    //
// run    : npx jest --clearCache                    //
//          npm test                                 //
//---------------------------------------------------//

import axios from "axios";
import { NswTransportService } from "../nswTransportService";

//------------//
//---mockup---//
//------------//s

// Mock axios
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock Date
const mockDate = new Date("2024-03-01T10:00:00Z");
const mockApiResponse = {
  data: {
    features: [
      {
        properties: {
          lastUpdated: "2024-03-01T12:00:00Z", // Should pass (same day)
          title: "Passed Hazard",
        },
      },
      {
        properties: {
          lastUpdated: "2024-02-28T23:59:59Z", // Should fail (previous day)
          title: "Failed Hazard",
        },
      },
    ],
  },
};

describe("NswTransportService", () => {
  //--------------------//
  //---initialization---//
  //--------------------//
  const mockFunctionUrl =
    "https://frlpitizjnrfvrrysowg.supabase.co/functions/v1/get-hazard";
  const mockAnonKey = "sb_publishable_u5NU_wiNoDX72v_uW-p3Kw_-jywt0ue";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  //-----------------------------------//
  //---Test: fetchTrafficHazardApi()---//
  //-----------------------------------//
  it("should fetch hazards from Supabase and filter by date correctly", async () => {
    mockedAxios.get.mockResolvedValueOnce(mockApiResponse);

    const results = await NswTransportService.fetchTrafficHazardApi(
      "Sydney",
      "incident",
      mockDate,
    );

    // 3. Assertions
    // Check if axios was called with correct Supabase URL and Headers
    expect(mockedAxios.get).toHaveBeenCalledWith(
      mockFunctionUrl,
      expect.objectContaining({
        headers: {
          "apikey": mockAnonKey,
          "Authorization": `Bearer ${mockAnonKey}`, // New format
          "Accept": "application/json",
          "User-Agent": "MyTrafficApp/1.0",
        },
        params: {
          hazardType: "incident",
          region: "Sydney",
        },
        timeout: 15000, // Add this to match the code too
      }),
    );

    // Check if filtering worked (only 1 item should remain)
    expect(results.length).toBe(1);
    expect(results[0].properties.title).toBe("Passed Hazard");
  });

  it("should return empty array and log error when API fails", async () => {
    const consoleSpy = jest.spyOn(console, "error").mockImplementation();
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    const results = await NswTransportService.fetchTrafficHazardApi(
      "Sydney",
      "incident",
      new Date(),
    );

    expect(results).toEqual([]);
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});
