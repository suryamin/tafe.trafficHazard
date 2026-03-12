//---------------------------------------------------//
// created: 25/02/2026                               //
// updated: 06/03/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: fetchTrafficHazardApi.ts                 //
// use    : to get hazard data from nsw transport    //
//          via supabase                             //
//---------------------------------------------------//

import axios from "axios";
//------------------------------------------------------------//
import { TrafficHazardFeature } from "../models/trafficHazardFeatureModel";
//------------------------------------------------------------//

// const SUPABASE_ANON_KEY = `sb_publishable_u5NU_wiNoDX72v_uW-p3Kw_-jywt0ue`;
// const FUNCTION_URL =
//   `https://frlpitizjnrfvrrysowg.supabase.co/functions/v1/get-hazard`;
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || "";
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || "";
const FUNCTION_URL = `${SUPABASE_URL}/functions/v1/get-hazard`;

export class NswTransportService {
  static fetchTrafficHazardApi = async (
    region: string,
    hazardType: string,
    hazardDate: Date,
  ): Promise<TrafficHazardFeature[]> => {
    try {
      const type = hazardType.toLowerCase().trim();

      const params: any = {
        hazardType: type,
        region: region,
      };

      // const response = await axios.get(FUNCTION_URL, {
      //   headers: {
      //     "apikey": SUPABASE_ANON_KEY,
      //     "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
      //     "Accept": "application/json",
      //   },
      //   params,
      //   timeout: 15000,
      // });
      const response = await axios.get(FUNCTION_URL, {
        headers: {
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Accept": "application/json",
          "User-Agent": "MyTrafficApp/1.0",
        },
        params,
        timeout: 15000,
      });

      const data = response.data;

      if (!data || !Array.isArray(data.features)) {
        return [];
      }

      const features = data.features as TrafficHazardFeature[];

      //---normalize/reset selected date---//
      //The setHours method accepts four arguments:
      // 0 (Hours): Sets the hour to 12:00 AM.
      // 0 (Minutes): Sets the minutes to 0.
      // 0 (Seconds): Sets the seconds to 0.
      // 0 (Milliseconds): Sets the milliseconds to 0.
      const selectedStartDate = new Date(hazardDate);
      selectedStartDate.setHours(0, 0, 0, 0);

      //---filter selected date---//
      const filteredFeatures = features.filter((feature) => {
        const lastUpdated = feature.properties?.lastUpdated;
        if (!lastUpdated) return false;

        const hazardUpdatedDate = new Date(lastUpdated);

        if (isNaN(hazardUpdatedDate.getTime())) return false;

        return hazardUpdatedDate.getTime() >= selectedStartDate.getTime();
      });
      return filteredFeatures;
    } catch (error: any) {
      console.error(
        `Error fetching ${hazardType} hazards in ${region}:`,
        error.message,
      );
      return [];
    }
  };
}
