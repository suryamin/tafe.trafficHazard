//----------------------------------------------//
// created: 25/02/2026                          //
// updated: 26/02/2026                          //
// by     : suryamin                            //
// note   : tafe project assignment             //
// program: HazardTypeModel.ts                  //
// note   : type has collected from https://opendata.transport.nsw.gov.au/data/dataset/4b9a6b9b-118a-458d-938d-585ae5c24fe7/resource/5ff3ba21-cda9-4d30-acc2-98ee15184044/download/livetraffichazarddata_2_1.json                  //
// use    : HazardTypeModel used as enum value  //
// purpose: emulate enum advance manipulation   //
//          since typescript doesn't has        //
//----------------------------------------------//

export type HazardTypeModel =
  | "alpine"
  | "fire"
  | "flood"
  | "incident"
  | "majorevent"
  | "roadwork";

export interface HazardConfig {
  label: string;
  description: string;
  icon: any;
  color: string;
}

export const HazardTypeMap: Record<HazardTypeModel, HazardConfig> = {
  alpine: {
    label: "Alpine Conditions",
    description: "Snow, ice, or weather-related hazards in alpine regions.",
    icon: "ac-unit",
    color: "#00BCD4",
  },
  fire: {
    label: "Fire",
    description:
      "Bushfires or grass fires affecting road visibility and safety.",
    icon: "local-fire-department",
    color: "#E65100",
  },
  flood: {
    label: "Flood",
    description: "Road closures or hazards due to heavy rain and flooding.",
    icon: "water",
    color: "#0288D1",
  },
  incident: {
    label: "Traffic Incident",
    description: "Accidents, breakdowns, or debris on the roadway.",
    icon: "report-problem",
    color: "#D32F2F",
  },
  majorevent: {
    label: "Major Event",
    description:
      "Special events, sports, or festivals causing traffic changes.",
    icon: "celebration",
    color: "#0a0a0b",
  },
  roadwork: {
    label: "Roadworks",
    description: "Scheduled road maintenance, repairs, or upgrades.",
    icon: "engineering",
    color: "#F57C00",
  },
};

export const getHazardTypeEnum = (
  category?: string,
): HazardTypeModel | undefined => {
  if (!category) return undefined;

  const normalized = category.toLowerCase().replace(/\s+/g, "");

  return normalized in HazardTypeMap
    ? (normalized as HazardTypeModel)
    : undefined;
};
