//---------------------------------------------------//
// created: 05/03/2026                               //
// updated: 05/03/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: geocodingService.test.ts                 //
// use    : unit test for geocodingService.ts        //
// npm    : --save-dev @types/jest                   //
//          --save-dev babel-preset-expo             //
//          --save-dev babel-jest                    //
// run    : npx jest --clearCache                    //
//          npm test                                 //
//---------------------------------------------------//

import axios from "axios";
import { GeocodingService } from "../geocodingService";

//------------//
//---mockup---//
//------------//

// Mock the entire axios module
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("GeocodingService", () => {
  //--------------------//
  //---initialization---//
  //--------------------//
  const mockLat = -37.8368;
  const mockLng = 144.928;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  //---------------------------------//
  //---Test: fetchFullAddressApi()---//
  //---------------------------------//
  it("should return the display_name when the API call is successful", async () => {
    // 1. Arrange: Setup what the fake API should return
    const mockAddress = "123 React Native St, Melbourne, Australia";
    mockedAxios.get.mockResolvedValueOnce({
      data: { display_name: mockAddress },
    });

    // 2. Act: Call the service
    const result = await GeocodingService.fetchFullAddressApi(mockLat, mockLng);

    // 3. Assert: Check the result and the API call details
    expect(result).toBe(mockAddress);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.stringContaining(`lat=${mockLat}&lon=${mockLng}`),
      expect.objectContaining({
        headers: expect.objectContaining({
          "User-Agent": "MyReactNativeLabApp/1.0",
        }),
      }),
    );
  });

  it('should return "Address not found" if data is missing display_name', async () => {
    mockedAxios.get.mockResolvedValueOnce({
      data: {}, // No display_name here
    });

    const result = await GeocodingService.fetchFullAddressApi(mockLat, mockLng);

    expect(result).toBe("Address not found");
  });

  it('should return "Error fetching address" if the axios call fails', async () => {
    // Simulate a network error (e.g., 404 or 500)
    mockedAxios.get.mockRejectedValueOnce(new Error("Network Error"));

    const result = await GeocodingService.fetchFullAddressApi(mockLat, mockLng);

    expect(result).toBe("Error fetching address");
    // Verify that the error was logged to the console
    expect(console.error).toHaveBeenCalled();
  });
});
