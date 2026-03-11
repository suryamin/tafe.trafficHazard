//---------------------------------------------------//
// created: 05/03/2026                               //
// updated: 05/03/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: storageService.test.ts                   //
// use    : unit test for storageService.ts          //
//          use AsyncStorage as a mockup             //
// npm    : @react-native-async-storage/async-storage//
//          --save-dev @types/jest                   //
//          --save-dev babel-preset-expo             //
//          --save-dev babel-jest                    //
// run    : npx jest --clearCache                    //
//          npm test                                 //
//---------------------------------------------------//

import AsyncStorage from "@react-native-async-storage/async-storage";
import { Alert } from "react-native";
import { StorageService } from "../storageService";

//------------//
//---mockup---//
//------------//

// mock react-native
jest.mock("react-native", () => ({
  Alert: {
    alert: jest.fn(),
  },
}));

describe("StorageService", () => {
  //--------------------//
  //---initialization---//
  //--------------------//
  const mockHazard = { id: "1", type: "Pothole" } as any;

  const STORAGE_KEY = "@userkey";

  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();
  });

  //------------------------//
  //---Test: loadHazard()---//
  //------------------------//
  it("should return an empty array if no hazards are stored", async () => {
    const result = await StorageService.loadHazard();
    expect(result).toEqual([]);
  });

  it("should return parsed hazards when data exists", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([mockHazard]));
    const result = await StorageService.loadHazard();
    expect(result).toEqual([mockHazard]);
  });

  //-----------------------//
  //---Test: addHazard()---//
  //-----------------------//
  it("should add a new hazard and show success alert", async () => {
    const initialList: any[] = [];
    const result = await StorageService.addHazard(initialList, mockHazard);

    // Verify logic
    expect(result).toContainEqual(mockHazard);
    // Verify Alert was called
    expect(Alert.alert).toHaveBeenCalledWith(
      "Success",
      "Hazard saved successfully.",
    );
  });

  it("should not add duplicate hazards and show warning alert", async () => {
    const initialList = [mockHazard];
    const result = await StorageService.addHazard(initialList, mockHazard);

    expect(result.length).toBe(1);
    expect(Alert.alert).toHaveBeenCalledWith(
      "Already Saved",
      "This hazard is already in your storage.",
      [{ text: "OK" }],
    );
  });

  //--------------------------//
  //---Test: deleteHazard()---//
  //--------------------------//
  it("should remove a hazard by ID", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([mockHazard]));
    const result = await StorageService.deleteHazard("1");
    expect(result).toEqual([]);
  });

  //----------------------//
  //---Test: clearAll()---//
  //----------------------//
  it("should remove the storage item completely", async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([mockHazard]));
    await StorageService.clearAll();
    const storedValue = await AsyncStorage.getItem(STORAGE_KEY);
    expect(storedValue).toBeNull();
  });
});

//------------------------------test results------------------------------//
//> labs@1.0.0 test                                                       //
//> jest                                                                  //
//                                                                        //
// PASS  services/__test__/storageService.test.ts                         //
//  StorageService                                                        //
//    √ should return an empty array if no hazards are stored (2 ms)      //
//    √ should return parsed hazards when data exists                     //
//    √ should add a new hazard and show success alert (1 ms)             //
//    √ should not add duplicate hazards and show warning alert           //
//    √ should remove a hazard by ID                                      //
//    √ should remove the storage item completely                         //
//                                                                        //
//Test Suites: 1 passed, 1 total                                          //
//Tests:       6 passed, 6 total                                          //
//Snapshots:   0 total                                                    //
//Time:        1.1 s                                                      //
//Ran all test suites.                                                    //
//------------------------------------------------------------------------//
