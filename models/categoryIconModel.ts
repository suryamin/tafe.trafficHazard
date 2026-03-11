//----------------------------------------------//
// created: 26/02/2026                          //
// updated: 03/03/2026                          //
// by     : suryamin                            //
// note   : tafe project assignment             //
// program: categoryIconModel.ts                //
// use    : mapping variant return icon from    //
//          hazard type incident                //
//----------------------------------------------//

import { MaterialIcons } from "@expo/vector-icons";

export interface categoryIcon {
  label: string;
  icon: keyof typeof MaterialIcons.glyphMap;
  color: string;
}
