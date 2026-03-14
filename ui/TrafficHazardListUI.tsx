//---------------------------------------------------//
// created: 26/02/2026                               //
// updated: 03/03/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: TrafficHazardListUI.tsx                  //
// use    : diplay hazard list                       //
//---------------------------------------------------//

import React, { useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
//------------------------------------------------------------//
import { HelperService } from "../services/helperService";
import { getHazardTypeEnum, HazardTypeMap } from "../models/hazardTypeModel";
import { styles } from "../style";
import { StorageService } from "../services/storageService";
//------------------------------------------------------------//

export type RootStackParamList = {
  Home: undefined;
  HazardList: {
    hazards: any[];
    fromStorage?: boolean;
  };
  HazardDetail: { hazard: any };
};

type HazardListRouteProp = RouteProp<RootStackParamList, "HazardList">;

export const TrafficHazardList = () => {
  //---navigation---//
  const navigation = useNavigation<any>();

  //---navigation parameter---//
  const route = useRoute<HazardListRouteProp>();
  const { hazards: initialHazards, fromStorage } = route.params;

  //---states for hazard list---//
  const [hazards, setHazards] = useState(initialHazards || []);

  //---------------------------//
  // delete handle for storage //
  //---------------------------//
  const handleDelete = async (id: number) => {
    try {
      const updatedList = await StorageService.deleteHazard(id);
      setHazards(updatedList);
    } catch (e) {
      console.log("Delete error:", e);
    }
  };

  //--------------//
  // render items //
  //--------------//
  const renderHazardItem = ({ item }: { item: any }) => {
    const props = item.properties || {};

    //---get hazard type enum---//
    const hazardTypeEnum = getHazardTypeEnum(props.CategoryIcon);
    const hazardEnumUtils = hazardTypeEnum && HazardTypeMap[hazardTypeEnum];

    //---get incident subtype---//
    const main = (props.mainCategory || "").toLowerCase();
    const icon = (props.CategoryIcon || "").toLowerCase();

    //---if incident subtype---//
    //---get mapping from getCategoryIcon---//
    //---otherwise default mapping from hazardEnumUtils---//
    const isIncident = main.includes("incident") ||
      icon.includes("incident") ||
      icon.includes("crash") ||
      icon.includes("breakdown") ||
      icon.includes("vehicle");

    const ui = isIncident
      ? HelperService.getCategoryIcon(
        props.mainCategory || "",
        props.CategoryIcon || "",
      )
      : hazardEnumUtils || {
        label: props.mainCategory || "Traffic Hazard",
        icon: "warning",
        color: "#D32F2F",
      };

    return (
      <TouchableOpacity
        style={styles.hazardItem}
        onPress={() => navigation.navigate("HazardDetail", { hazard: item })}
      >
        {/* ---header--- */}
        <View style={styles.headerRow}>
          <MaterialIcons
            name={ui.icon as any}
            size={30}
            color={ui.color || "#D32F2F"}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={styles.hazardTitle}>
              {props.roads?.[0]?.suburb || props.suburb || "NSW"}
            </Text>
            <Text style={[styles.hazardSubtitle, { color: ui.color }]}>
              {ui.label}
            </Text>
          </View>
          {fromStorage && (
            <TouchableOpacity
              testID="delete-button" // <--- Add this
              onPress={() => handleDelete(item.id)}
            >
              <MaterialIcons name="delete" size={22} color="#D32F2F" />
            </TouchableOpacity>
          )}
        </View>

        {/* ---location--- */}
        <Text style={styles.hazardRegion}>
          {HelperService.formatLocation(props)}
        </Text>

        {/* ---category--- */}
        <Text style={[styles.hazardTitle, { marginTop: 8 }]}>
          {props.mainCategory || props.displayName}
        </Text>

        {/* ---advice--- */}
        <Text style={styles.hazardDesc} numberOfLines={2}>
          {props.adviceA || props.displayName || "Drive with caution."}
        </Text>
      </TouchableOpacity>
    );
  };

  //--------------------//
  // render empty state //
  //--------------------//
  if (!hazards || hazards.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No hazards found.</Text>
      </View>
    );
  }

  //-------------//
  // hazard list //
  //-------------//
  return (
    <FlatList
      data={hazards}
      keyExtractor={(item) => item.id.toString()}
      style={{ marginBottom: 30 }}
      renderItem={renderHazardItem}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: 20,
      }}
    />
  );
};
