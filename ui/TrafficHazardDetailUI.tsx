//---------------------------------------------------//
// created: 26/02/2026                               //
// updated: 27/02/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: TrafficHazardDetailUI.tsx                //
// use    : diplay hazard detail                     //
//---------------------------------------------------//

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { MaterialIcons } from "@expo/vector-icons";
//------------------------------------------------------------//
import { styles } from "../style";
import { RootStackParamList } from "../App";
import { GeocodingService } from "../services/geocodingService";
import { HelperService } from "../services/helperService";
import { StorageService } from "../services/storageService";
import { TrafficHazardFeature } from "../models/trafficHazardFeatureModel";
import { HazardTypeMap, getHazardTypeEnum } from "../models/hazardTypeModel";
//------------------------------------------------------------//

export const TrafficHazardDetail = () => {
  //---navigation parameter---//
  const route = useRoute<RouteProp<RootStackParamList, "HazardDetail">>();
  const { hazard } = route.params;

  //---state for storage---//
  const [hazards, setHazards] = useState<TrafficHazardFeature[]>([]);
  const [saving, setSaving] = useState(false);

  //---helper variable---//
  const props = hazard.properties;
  const geometry = hazard.geometry;
  const roadInfo = props.roads?.[0];

  //---state for gps address---//
  const [addr, setAddr] = useState<string>("");

  //---state for Loading---//
  const [loading, setLoading] = useState(true);

  //---get HazardTypeEnum (from HazardTypeModel)---//
  const hazardTypeEnum = getHazardTypeEnum(props.CategoryIcon);
  const hazardEnumUtils = hazardTypeEnum && HazardTypeMap[hazardTypeEnum];

  //---format date---//
  const formatedDate = (timestamp?: number) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleString();
  };

  //---initial---//
  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);

      try {
        //---load hazards from storage---//
        const storedHazards = await StorageService.loadHazard();
        setHazards(storedHazards ?? []);

        //---fetch GPS address---//
        if (!geometry?.coordinates) {
          setAddr("Address not available");
          return;
        }
        const [lng, lat] = geometry.coordinates;
        const fullAddress = await GeocodingService.fetchFullAddressApi(
          lat,
          lng,
        );
        setAddr(fullAddress);
      } catch (error) {
        console.error("Initialization error:", error);
        setAddr("Error loading address");
      } finally {
        setLoading(false);
      }
    };
    initializeData();
  }, []);

  //---save hazard to storage---//
  const handleSave = async () => {
    try {
      setSaving(true);
      const updated = await StorageService.addHazard(hazards, hazard);
      setHazards(updated);
    } catch (error) {
      console.error("Save failed:", error);
      Alert.alert("Error", "Failed to save hazard.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.hazardItem}>
        {/* ---header--- */}
        <View style={styles.headerRow}>
          <MaterialIcons
            name={hazardEnumUtils?.icon || "warning"}
            size={26}
            color="red"
            style={styles.icon}
          />

          <Text style={styles.hazardTitle}>
            {roadInfo?.suburb ? `${roadInfo.suburb.toUpperCase()} ` : ""}
            {props.displayName || props.mainCategory}
          </Text>

          {/* ---save button--- */}
          <TouchableOpacity
            onPress={handleSave}
            style={{ padding: 4 }}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" />
            ) : (
              <MaterialIcons name="save" size={22} color="#1976D2" />
            )}
          </TouchableOpacity>
        </View>

        {/* ---location--- */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Location:</Text>
          <Text style={styles.hazardRegion}>
            {HelperService.formatLocation(props)}
          </Text>
        </View>

        {/* ---advice--- */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Advice:</Text>
          {props.adviceA && (
            <Text style={styles.hazardDesc}>{props.adviceA}</Text>
          )}
          {props.adviceB && (
            <Text style={styles.hazardDesc}>{props.adviceB}</Text>
          )}
          {props.adviceC && (
            <Text style={styles.hazardDesc}>{props.adviceC}</Text>
          )}
          {props.otherAdvice && (
            <Text style={styles.hazardDesc}>
              {props.otherAdvice.replace(/<[^>]+>/g, "")}
            </Text>
          )}
        </View>

        {/* ---GPS address--- */}
        <View style={{ marginTop: 10 }}>
          <Text style={{ fontWeight: "bold" }}>Address (based on GPS):</Text>
          {loading ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text style={styles.hazardDesc}>{addr || "Address not found"}</Text>
          )}
        </View>

        {/* ---dates--- */}
        <Text style={styles.hazardTime}>
          Created: {formatedDate(props.created)}
          {"\n"}
          Last Updated: {formatedDate(props.lastUpdated)}
        </Text>
      </View>
    </ScrollView>
  );
};
