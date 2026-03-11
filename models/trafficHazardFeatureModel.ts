//-----------------------------------------------------------//
// created: 26/02/2026                                       //
// updated: 26/02/2026                                       //
// by     : suryamin                                         //
// note   : tafe project assignment                          //
// program: TrafficHazardFeatureModel.ts                     //
// use    : filter unused TrafficHazardAll data              //
//          from api (only use needed fields and make        //
//          it easier to remember and eliminate unnesccessary//
//          debug on a potential wrong data type)            //
//-----------------------------------------------------------//

export interface TrafficHazardFeature {
  type: "Feature";
  id: number;
  geometry: {
    type: string;
    coordinates: [number, number];
    collections?: any[];
  };
  properties: {
    displayName: string;
    mainCategory: string;
    CategoryIcon?: string;
    created?: number;
    lastUpdated?: number;
    adviceA?: string;
    adviceB?: string;
    adviceC?: string;
    otherAdvice?: string;
    roads?: any[];
    [key: string]: any;
  };
}
