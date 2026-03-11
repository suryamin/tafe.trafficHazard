//-------------------------------------------------//
// created: 25/02/2026                             //
// updated: 26/02/2026                             //
// by     : suryamin                               //
// note   : tafe project assignment                //
// program: NswRegionsModel.ts                     //
// note   : region has collected from return data  //
//          "region" field                         //
// purpose: emulate enum advance manipulation      //
//          since typescript doesn't has           //
//-------------------------------------------------//

import { MaterialIcons } from "@expo/vector-icons";

export type NswRegionModel =
  | "Sydney"
  | "Blue Mountains"
  | "Central Coast"
  | "Central NSW"
  | "Far West NSW"
  | "Hunter"
  | "New England North West"
  | "North Coast NSW"
  | "Riverina"
  | "Snowy Mountains"
  | "South Coast"
  | "Southern Highlands"
  | "The Murray";

export const NswRegionMap: Record<
  NswRegionModel,
  {
    label: string;
    description: string;
    icon: keyof typeof MaterialIcons.glyphMap;
    color: string;
  }
> = {
  Sydney: {
    label: "Sydney",
    description:
      "The metropolitan area around Sydney, including CBD and suburbs.",
    icon: "location-city",
    color: "#007AFF", // System Blue
  },
  "Blue Mountains": {
    label: "Blue Mountains",
    description:
      "Mountainous region west of Sydney, prone to bushfires and landslides.",
    icon: "terrain",
    color: "#1A237E", // Deep Indigo
  },
  "Central Coast": {
    label: "Central Coast",
    description:
      "Coastal region north of Sydney, susceptible to flooding and storms.",
    icon: "beach-access",
    color: "#00BCD4", // Cyan/Teal
  },
  "Central NSW": {
    label: "Central NSW",
    description: "Includes Bathurst, Orange, and Dubbo; key agricultural hub.",
    icon: "agriculture",
    color: "#8D6E63", // Earthy Brown
  },
  "Far West NSW": {
    label: "Far West NSW",
    description: "Remote western areas including Broken Hill.",
    icon: "wb-sunny",
    color: "#E65100", // Deep Orange
  },
  Hunter: {
    label: "Hunter",
    description:
      "Region north of Sydney, includes Newcastle and coal mining areas.",
    icon: "whatshot",
    color: "#C62828", // Fire Red
  },
  "New England North West": {
    label: "New England North West",
    description: "Highland region including Tamworth and Armidale.",
    icon: "filter-hdr",
    color: "#2E7D32", // Forest Green
  },
  "North Coast NSW": {
    label: "North Coast NSW",
    description: "Coastal region from Port Macquarie up to the QLD border.",
    icon: "waves",
    color: "#0288D1", // Ocean Blue
  },
  Riverina: {
    label: "Riverina",
    description:
      "Agricultural region in south-western NSW, including Wagga Wagga.",
    icon: "grass",
    color: "#7CB342", // Light Green
  },
  "Snowy Mountains": {
    label: "Snowy Mountains",
    description: "Alpine region, prone to snow and ice hazards.",
    icon: "ac-unit",
    color: "#90CAF9", // Light Sky Blue
  },
  "South Coast": {
    label: "South Coast",
    description:
      "Coastal region south of Sydney, prone to storms and bushfires.",
    icon: "beach-access",
    color: "#0097A7", // Darker Teal
  },
  "Southern Highlands": {
    label: "Southern Highlands",
    description: "Cool climate region south of Sydney, includes Bowral.",
    icon: "park",
    color: "#43A047", // Leaf Green
  },
  "The Murray": {
    label: "The Murray",
    description: "Region along the Murray River border with Victoria.",
    icon: "directions-boat",
    color: "#1565C0", // River Blue
  },
};

export const getNswRegionEnum = (
  category?: string,
): NswRegionModel | undefined => {
  if (!category) return undefined;

  const normalized = category.toLowerCase().replace(/\s+/g, "");

  return normalized in NswRegionMap
    ? (normalized as NswRegionModel)
    : undefined;
};
