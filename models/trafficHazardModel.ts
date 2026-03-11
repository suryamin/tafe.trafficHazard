// To parse this data:
//
//   import { Convert, TrafficHazardAll } from "./file";
//
//   const trafficHazardAll = Convert.toTrafficHazardAll(json);
//
// These functions will throw an error if the JSON doesn't
// match the expected interface, even if the JSON is valid.

export interface TrafficHazardAll {
  geometry: any;
  properties: any;
  type: string;
  lastPublished: number;
  layerName: LayerName;
  rights: Rights;
  features: Feature[];
}

export interface Feature {
  type: FeatureType;
  id: number;
  geometry: Geometry;
  properties: Properties;
}

export interface Geometry {
  type: CollectionType;
  coordinates: number[];
  collections: Collection[];
}

export interface Collection {
  type: CollectionType;
  coordinates: number[];
}

export enum CollectionType {
  Point = "Point",
}

export interface Properties {
  webLinks: any[];
  headline: string;
  periods: any[];
  speedLimit: number;
  weblinkUrl: null;
  expectedDelay: number;
  ended: boolean;
  isNewIncident: boolean;
  publicTransport: string;
  impactingNetwork: boolean;
  subCategoryB: null;
  arrangementAttachments: any[];
  isInitialReport: boolean;
  created: number;
  isMajor: boolean;
  name: null;
  subCategoryA: SubCategoryA;
  adviceA: AdviceA;
  adviceB: AdviceB;
  adviceC: AdviceC;
  incidentKind: IncidentKind;
  mainCategory: DisplayName;
  lastUpdated: number;
  otherAdvice: string;
  arrangementElements: any[];
  diversions: string;
  additionalInfo: any[];
  weblinkName: null;
  attendingGroups: null;
  encodedPolylines: EncodedPolyline[];
  displayName: DisplayName;
  roads: Road[];
  isLocalRoad: IsLocalRoad;
  CategoryIcon: LayerName;
}

export enum LayerName {
  Flood = "Flood",
}

export enum AdviceA {
  NeverDriveThroughFloodwater = "Never drive through floodwater",
  PlanYourJourney = "Plan your journey",
}

export enum AdviceB {
  AvoidTheArea = "Avoid the area",
  CheckSignage = "Check signage",
  PlanYourJourney = "Plan your journey",
}

export enum AdviceC {
  Empty = " ",
}

export enum DisplayName {
  Flooding = "FLOODING",
}

export interface EncodedPolyline {
  levels: string;
  direction: Direction;
  coords: string;
}

export enum Direction {
  BothDirections = "BOTH_DIRECTIONS",
}

export enum IncidentKind {
  Unplanned = "Unplanned",
}

export enum IsLocalRoad {
  LocalRoad = "Local road",
  StateRoad = "State road",
}

export interface Road {
  conditionTendency: string;
  crossStreet: string;
  delay: string;
  impactedLanes: ImpactedLane[];
  locationQualifier: LocationQualifier;
  mainStreet: string;
  quadrant: string;
  queueLength: number;
  region: Region;
  secondLocation: SecondLocation;
  suburb: string;
  trafficVolume: string;
}

export interface ImpactedLane {
  affectedDirection: AffectedDirection;
  closedLanes: string;
  description: string;
  extent: Extent;
  numberOfLanes: string;
  roadType: RoadType;
}

export enum AffectedDirection {
  BothDirections = "Both directions",
}

export enum Extent {
  Closed = "Closed",
}

export enum RoadType {
  Highway = "Highway",
  Road = "Road",
}

export enum LocationQualifier {
  At = "at",
  Between = "between",
}

export enum Region {
  FarWestNSW = "Far West NSW",
}

export enum SecondLocation {
  BindaraRoad = "Bindara Road",
  Empty = "",
  HamiltonGateRoad = "Hamilton Gate Road",
  JoulnieRoad = "Joulnie Road",
  PimparaLakeRoad = "Pimpara Lake Road",
  WakaRoad = "Waka Road",
}

export enum SubCategoryA {
  Null = "null",
}

export enum FeatureType {
  Feature = "Feature",
}

export interface Rights {
  copyright: string;
  licence: string;
}

// Converts JSON strings to/from your types
// and asserts the results of JSON.parse at runtime
export class Convert {
  public static toTrafficHazardAll(json: string): TrafficHazardAll {
    return cast(JSON.parse(json), r("TrafficHazardAll"));
  }

  public static trafficHazardAllToJson(value: TrafficHazardAll): string {
    return JSON.stringify(uncast(value, r("TrafficHazardAll")), null, 2);
  }
}

function invalidValue(typ: any, val: any, key: any, parent: any = ""): never {
  const prettyTyp = prettyTypeName(typ);
  const parentText = parent ? ` on ${parent}` : "";
  const keyText = key ? ` for key "${key}"` : "";
  throw Error(
    `Invalid value${keyText}${parentText}. Expected ${prettyTyp} but got ${JSON.stringify(val)}`,
  );
}

function prettyTypeName(typ: any): string {
  if (Array.isArray(typ)) {
    if (typ.length === 2 && typ[0] === undefined) {
      return `an optional ${prettyTypeName(typ[1])}`;
    } else {
      return `one of [${typ
        .map((a) => {
          return prettyTypeName(a);
        })
        .join(", ")}]`;
    }
  } else if (typeof typ === "object" && typ.literal !== undefined) {
    return typ.literal;
  } else {
    return typeof typ;
  }
}

function jsonToJSProps(typ: any): any {
  if (typ.jsonToJS === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.json] = { key: p.js, typ: p.typ }));
    typ.jsonToJS = map;
  }
  return typ.jsonToJS;
}

function jsToJSONProps(typ: any): any {
  if (typ.jsToJSON === undefined) {
    const map: any = {};
    typ.props.forEach((p: any) => (map[p.js] = { key: p.json, typ: p.typ }));
    typ.jsToJSON = map;
  }
  return typ.jsToJSON;
}

function transform(
  val: any,
  typ: any,
  getProps: any,
  key: any = "",
  parent: any = "",
): any {
  function transformPrimitive(typ: string, val: any): any {
    if (typeof typ === typeof val) return val;
    return invalidValue(typ, val, key, parent);
  }

  function transformUnion(typs: any[], val: any): any {
    // val must validate against one typ in typs
    const l = typs.length;
    for (let i = 0; i < l; i++) {
      const typ = typs[i];
      try {
        return transform(val, typ, getProps);
      } catch (_) {}
    }
    return invalidValue(typs, val, key, parent);
  }

  function transformEnum(cases: string[], val: any): any {
    if (cases.indexOf(val) !== -1) return val;
    return invalidValue(
      cases.map((a) => {
        return l(a);
      }),
      val,
      key,
      parent,
    );
  }

  function transformArray(typ: any, val: any): any {
    // val must be an array with no invalid elements
    if (!Array.isArray(val)) return invalidValue(l("array"), val, key, parent);
    return val.map((el) => transform(el, typ, getProps));
  }

  function transformDate(val: any): any {
    if (val === null) {
      return null;
    }
    const d = new Date(val);
    if (isNaN(d.valueOf())) {
      return invalidValue(l("Date"), val, key, parent);
    }
    return d;
  }

  function transformObject(
    props: { [k: string]: any },
    additional: any,
    val: any,
  ): any {
    if (val === null || typeof val !== "object" || Array.isArray(val)) {
      return invalidValue(l(ref || "object"), val, key, parent);
    }
    const result: any = {};
    Object.getOwnPropertyNames(props).forEach((key) => {
      const prop = props[key];
      const v = Object.prototype.hasOwnProperty.call(val, key)
        ? val[key]
        : undefined;
      result[prop.key] = transform(v, prop.typ, getProps, key, ref);
    });
    Object.getOwnPropertyNames(val).forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(props, key)) {
        result[key] = transform(val[key], additional, getProps, key, ref);
      }
    });
    return result;
  }

  if (typ === "any") return val;
  if (typ === null) {
    if (val === null) return val;
    return invalidValue(typ, val, key, parent);
  }
  if (typ === false) return invalidValue(typ, val, key, parent);
  let ref: any = undefined;
  while (typeof typ === "object" && typ.ref !== undefined) {
    ref = typ.ref;
    typ = typeMap[typ.ref];
  }
  if (Array.isArray(typ)) return transformEnum(typ, val);
  if (typeof typ === "object") {
    return typ.hasOwnProperty("unionMembers")
      ? transformUnion(typ.unionMembers, val)
      : typ.hasOwnProperty("arrayItems")
        ? transformArray(typ.arrayItems, val)
        : typ.hasOwnProperty("props")
          ? transformObject(getProps(typ), typ.additional, val)
          : invalidValue(typ, val, key, parent);
  }
  // Numbers can be parsed by Date but shouldn't be.
  if (typ === Date && typeof val !== "number") return transformDate(val);
  return transformPrimitive(typ, val);
}

function cast<T>(val: any, typ: any): T {
  return transform(val, typ, jsonToJSProps);
}

function uncast<T>(val: T, typ: any): any {
  return transform(val, typ, jsToJSONProps);
}

function l(typ: any) {
  return { literal: typ };
}

function a(typ: any) {
  return { arrayItems: typ };
}

function u(...typs: any[]) {
  return { unionMembers: typs };
}

function o(props: any[], additional: any) {
  return { props, additional };
}

function m(additional: any) {
  return { props: [], additional };
}

function r(name: string) {
  return { ref: name };
}

const typeMap: any = {
  TrafficHazardAll: o(
    [
      { json: "type", js: "type", typ: "" },
      { json: "lastPublished", js: "lastPublished", typ: 0 },
      { json: "layerName", js: "layerName", typ: r("LayerName") },
      { json: "rights", js: "rights", typ: r("Rights") },
      { json: "features", js: "features", typ: a(r("Feature")) },
    ],
    false,
  ),
  Feature: o(
    [
      { json: "type", js: "type", typ: r("FeatureType") },
      { json: "id", js: "id", typ: 0 },
      { json: "geometry", js: "geometry", typ: r("Geometry") },
      { json: "properties", js: "properties", typ: r("Properties") },
    ],
    false,
  ),
  Geometry: o(
    [
      { json: "type", js: "type", typ: r("CollectionType") },
      { json: "coordinates", js: "coordinates", typ: a(3.14) },
      { json: "collections", js: "collections", typ: a(r("Collection")) },
    ],
    false,
  ),
  Collection: o(
    [
      { json: "type", js: "type", typ: r("CollectionType") },
      { json: "coordinates", js: "coordinates", typ: a(3.14) },
    ],
    false,
  ),
  Properties: o(
    [
      { json: "webLinks", js: "webLinks", typ: a("any") },
      { json: "headline", js: "headline", typ: "" },
      { json: "periods", js: "periods", typ: a("any") },
      { json: "speedLimit", js: "speedLimit", typ: 0 },
      { json: "weblinkUrl", js: "weblinkUrl", typ: null },
      { json: "expectedDelay", js: "expectedDelay", typ: 0 },
      { json: "ended", js: "ended", typ: true },
      { json: "isNewIncident", js: "isNewIncident", typ: true },
      { json: "publicTransport", js: "publicTransport", typ: "" },
      { json: "impactingNetwork", js: "impactingNetwork", typ: true },
      { json: "subCategoryB", js: "subCategoryB", typ: null },
      {
        json: "arrangementAttachments",
        js: "arrangementAttachments",
        typ: a("any"),
      },
      { json: "isInitialReport", js: "isInitialReport", typ: true },
      { json: "created", js: "created", typ: 0 },
      { json: "isMajor", js: "isMajor", typ: true },
      { json: "name", js: "name", typ: null },
      { json: "subCategoryA", js: "subCategoryA", typ: r("SubCategoryA") },
      { json: "adviceA", js: "adviceA", typ: r("AdviceA") },
      { json: "adviceB", js: "adviceB", typ: r("AdviceB") },
      { json: "adviceC", js: "adviceC", typ: r("AdviceC") },
      { json: "incidentKind", js: "incidentKind", typ: r("IncidentKind") },
      { json: "mainCategory", js: "mainCategory", typ: r("DisplayName") },
      { json: "lastUpdated", js: "lastUpdated", typ: 0 },
      { json: "otherAdvice", js: "otherAdvice", typ: "" },
      { json: "arrangementElements", js: "arrangementElements", typ: a("any") },
      { json: "diversions", js: "diversions", typ: "" },
      { json: "additionalInfo", js: "additionalInfo", typ: a("any") },
      { json: "weblinkName", js: "weblinkName", typ: null },
      { json: "attendingGroups", js: "attendingGroups", typ: null },
      {
        json: "encodedPolylines",
        js: "encodedPolylines",
        typ: a(r("EncodedPolyline")),
      },
      { json: "displayName", js: "displayName", typ: r("DisplayName") },
      { json: "roads", js: "roads", typ: a(r("Road")) },
      { json: "isLocalRoad", js: "isLocalRoad", typ: r("IsLocalRoad") },
      { json: "CategoryIcon", js: "CategoryIcon", typ: r("LayerName") },
    ],
    false,
  ),
  EncodedPolyline: o(
    [
      { json: "levels", js: "levels", typ: "" },
      { json: "direction", js: "direction", typ: r("Direction") },
      { json: "coords", js: "coords", typ: "" },
    ],
    false,
  ),
  Road: o(
    [
      { json: "conditionTendency", js: "conditionTendency", typ: "" },
      { json: "crossStreet", js: "crossStreet", typ: "" },
      { json: "delay", js: "delay", typ: "" },
      { json: "impactedLanes", js: "impactedLanes", typ: a(r("ImpactedLane")) },
      {
        json: "locationQualifier",
        js: "locationQualifier",
        typ: r("LocationQualifier"),
      },
      { json: "mainStreet", js: "mainStreet", typ: "" },
      { json: "quadrant", js: "quadrant", typ: "" },
      { json: "queueLength", js: "queueLength", typ: 0 },
      { json: "region", js: "region", typ: r("Region") },
      {
        json: "secondLocation",
        js: "secondLocation",
        typ: r("SecondLocation"),
      },
      { json: "suburb", js: "suburb", typ: "" },
      { json: "trafficVolume", js: "trafficVolume", typ: "" },
    ],
    false,
  ),
  ImpactedLane: o(
    [
      {
        json: "affectedDirection",
        js: "affectedDirection",
        typ: r("AffectedDirection"),
      },
      { json: "closedLanes", js: "closedLanes", typ: "" },
      { json: "description", js: "description", typ: "" },
      { json: "extent", js: "extent", typ: r("Extent") },
      { json: "numberOfLanes", js: "numberOfLanes", typ: "" },
      { json: "roadType", js: "roadType", typ: r("RoadType") },
    ],
    false,
  ),
  Rights: o(
    [
      { json: "copyright", js: "copyright", typ: "" },
      { json: "licence", js: "licence", typ: "" },
    ],
    false,
  ),
  CollectionType: ["Point"],
  LayerName: ["Flood"],
  AdviceA: ["Never drive through floodwater", "Plan your journey"],
  AdviceB: ["Avoid the area", "Check signage", "Plan your journey"],
  AdviceC: [" "],
  DisplayName: ["FLOODING"],
  Direction: ["BOTH_DIRECTIONS"],
  IncidentKind: ["Unplanned"],
  IsLocalRoad: ["Local road", "State road"],
  AffectedDirection: ["Both directions"],
  Extent: ["Closed"],
  RoadType: ["Highway", "Road"],
  LocationQualifier: ["at", "between"],
  Region: ["Far West NSW"],
  SecondLocation: [
    "Bindara Road",
    "",
    "Hamilton Gate Road",
    "Joulnie Road",
    "Pimpara Lake Road",
    "Waka Road",
  ],
  SubCategoryA: ["null"],
  FeatureType: ["Feature"],
};
