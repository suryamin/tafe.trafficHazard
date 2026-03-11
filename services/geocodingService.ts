//---------------------------------------------------//
// created: 26/02/2026                               //
// updated: 27/02/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: fetchFullAddressApi.ts                   //
// use    : to get full address from lat,lng         //
//---------------------------------------------------//

import axios from "axios";
//------------------------------------------------------------//

export class GeocodingService {
  static fetchFullAddressApi = async (
    lat: number,
    lng: number,
  ): Promise<string> => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            "User-Agent": "MyReactNativeLabApp/1.0",
            Accept: "application/json",
            "Accept-Language": "en",
          },
        },
      );

      const data = await response.data;

      if (data && data.display_name) {
        return data.display_name;
      }

      return "Address not found";
    } catch (error) {
      console.error("Failed to fetch address via OSM", error);
      return "Error fetching address";
    }
  };
}
