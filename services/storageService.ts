//---------------------------------------------------//
// created: 26/02/2026                               //
// updated: 03/03/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: storageService.ts                        //
// use    : storage crud                             //
// npm    : @react-native-async-storage/async-storage//
//---------------------------------------------------//

import { Alert, Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
//------------------------------------------------------------//
import { TrafficHazardFeature } from "../models/trafficHazardFeatureModel";
//------------------------------------------------------------//

export const STORAGE_KEY = "@userkey";

export class StorageService {
  static async loadHazard(): Promise<TrafficHazardFeature[]> {
    try {
      const value = await AsyncStorage.getItem(STORAGE_KEY);
      if (!value) return [];
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.log("loadHazard error:", e);
      return [];
    }
  }

  static async addHazard(
    list: TrafficHazardFeature[],
    hazard: TrafficHazardFeature,
  ): Promise<TrafficHazardFeature[]> {
    try {
      const exists = list.some((item) => item.id === hazard.id);
      if (exists) {
        Alert.alert(
          "Already Saved",
          "This hazard is already in your storage.",
          [{ text: "OK" }],
        );
        return list;
      } else {
        Alert.alert("Success", "Hazard saved successfully.");
      }
      const updatedList = [...list, hazard];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));
      return updatedList;
    } catch (e) {
      console.log("addHazard error:", e);
      return list;
    }
  }

  static async deleteHazard(
    id: string | number,
  ): Promise<TrafficHazardFeature[]> {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      const list: TrafficHazardFeature[] = stored ? JSON.parse(stored) : [];

      const updatedList = list.filter((item) => String(item.id) !== String(id));

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedList));

      return updatedList;
    } catch (e) {
      console.log("deleteHazard error:", e);
      return [];
    }
  }

  static async clearAll(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.log("clearAll error:", e);
    }
  }
}
