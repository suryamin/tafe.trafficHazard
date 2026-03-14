//---------------------------------------------------//
// created: 26/02/2026                               //
// updated: 04/03/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: helperService.ts                         //
// use    : helper function                          //
//---------------------------------------------------//

import { Alert, Platform } from "react-native";
import { categoryIcon } from "../models/categoryIconModel";
//------------------------------------------------------------//

export class HelperService {
  //------------------------//
  // only use in this class //
  //------------------------//
  private static readonly mainHazardMap: Record<string, categoryIcon> = {
    fire: { label: "Fire", icon: "local-fire-department", color: "#D32F2F" },
    flood: { label: "Flood", icon: "water", color: "#1976D2" },
    roadwork: { label: "Roadwork", icon: "construction", color: "#F57C00" },
    majorevent: { label: "Major Event", icon: "event", color: "#1976D2" },
    incident: { label: "Incident", icon: "warning", color: "#D32F2F" },
    alpine: { label: "Alpine", icon: "terrain", color: "#4CAF50" },
  };

  //------------------------//
  // only use in this class //
  //------------------------//
  private static readonly incidentSubMap: Record<string, categoryIcon> = {
    Crash: { label: "Crash", icon: "directions-car", color: "#D32F2F" },
    Breakdown: { label: "Breakdown", icon: "build", color: "#F57C00" },
    Hazard: { label: "Hazard", icon: "report", color: "#FBC02D" },
    ChangedConditions: {
      label: "Conditions",
      icon: "alt-route",
      color: "#757575",
    },
    TrafficSignals: { label: "Signals", icon: "traffic", color: "#D32F2F" },
    AdverseWeather: { label: "Weather", icon: "cloud", color: "#607D8B" },
  };

  //---------------//
  // icons mapping //
  //---------------//
  static getCategoryIcon(
    mainCategory: string,
    subCategory?: string,
  ): categoryIcon {
    const subKey = (subCategory || "").trim();
    const mainKey = (mainCategory || "").toLowerCase().replace(/\s+/g, "");

    //---check incident subtypes first---//
    if (this.incidentSubMap[subKey]) return this.incidentSubMap[subKey];

    //---check main hazard types---//
    if (this.mainHazardMap[mainKey]) return this.mainHazardMap[mainKey];

    //---fallback---//
    return {
      label: mainCategory || "Traffic Hazard",
      icon: "warning",
      color: "#D32F2F",
    };
  }

  //--------------------------------------------------//
  // format location --> follow NSW Live Traffic Apps //
  //--------------------------------------------------//
  static formatLocation(props: any): string {
    const roadInfo = props.roads?.[0];
    if (!roadInfo) return props.displayName || "";

    const qualifier = props.locationQualifier?.trim() || "";
    const mainStreet = roadInfo.mainStreet?.trim() || "";
    const crossStreet = roadInfo.crossStreet?.trim() || "";
    const secondLocation = roadInfo.secondLocation?.trim() || "";
    const suburb = roadInfo.suburb?.trim() || "";
    const direction = roadInfo.direction?.trim()
      ? `(${roadInfo.direction})`
      : "";

    let locationText = mainStreet;

    //---Logic: Only display "at" if crossStreet is not blank---/
    if (crossStreet.length > 0) {
      locationText += ` between ${crossStreet}`;
    }

    //--Logic: Only display "and" if secondLocation is not blank---/
    if (secondLocation.length > 0) {
      locationText += ` and ${secondLocation}`;
    }

    //--Build final sentence---/
    const fullSentence = `${qualifier} ${locationText}, ${suburb} ${direction}`
      .trim();

    //--Remove double spaces and capitalize first letter---/
    return fullSentence
      .replace(/\s+/g, " ")
      .replace(/^./, (str) => str.toUpperCase());
  }
}
