//----------------------------------------------------//
// created: 25/02/2026                                //
// updated: 04/03/2026                                //
// by     : suryamin                                  //
// note   : tafe project assignment                   //
// program: HomeUI.tsx                                //
// npm    : react-native-dropdown-picker              //
//          @expo/vector-icons                        //
//          react-native-modal-datetime-picker        //
//----------------------------------------------------//

import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import DropDownPicker from "react-native-dropdown-picker";
import { MaterialIcons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
//------------------------------------------------------------//
import { RootStackParamList } from "./App";
import { NswRegionMap, NswRegionModel } from "./models/nswRegionsModel";
import { HazardTypeMap, HazardTypeModel } from "./models/hazardTypeModel";
import { TrafficHazardFeature } from "./models/trafficHazardFeatureModel";
import { NswTransportService } from "./services/nswTransportService";
import { StorageService } from "./services/storageService";
import { styles } from "./style";
//------------------------------------------------------------//

type HomeScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Home"
>;

export const HomeScreen = () => {
  //---navigation---//
  const navigation = useNavigation<HomeScreenNavigationProp>();

  //---states for Dropdown---//
  const [regionOpen, setRegionOpen] = useState(false);
  const [hazardOpen, setHazardOpen] = useState(false);

  //---states for Selection---//
  const [selectedRegion, setSelectedRegion] = useState<NswRegionModel>(
    "Sydney",
  );
  const [selectedHazard, setSelectedHazard] = useState<HazardTypeModel>(
    "incident",
  );
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);

  //---state for Loading---//
  const [loading, setLoading] = useState(false);

  //---state for storage---//
  const [hazards, setHazards] = useState<TrafficHazardFeature[]>([]);

  //---initial---//
  useFocusEffect(
    useCallback(() => {
      const loadStoredHazards = async () => {
        try {
          const storedHazards = await StorageService.loadHazard();
          if (storedHazards && Array.isArray(storedHazards)) {
            setHazards(storedHazards);
          } else {
            setHazards([]);
          }
          setSelectedDate(new Date());
        } catch (error) {
          console.error("Failed to load hazards:", error);
          setHazards([]);
        }
      };
      loadStoredHazards();
    }, []),
  );

  //---map region data to dropdown---//
  const regionItems = Object.keys(NswRegionMap).map((key) => {
    const region = key as NswRegionModel;
    return {
      label: NswRegionMap[region].label,
      value: region,
      icon: () => (
        <MaterialIcons
          name={NswRegionMap[region].icon}
          size={20}
          color={NswRegionMap[region].color}
        />
      ),
    };
  });

  //---map hazard data to dropdown---//
  const hazardItems = Object.keys(HazardTypeMap).map((key) => {
    const hazard = key as HazardTypeModel;
    return {
      label: HazardTypeMap[hazard].label,
      value: hazard,
      icon: () => (
        <MaterialIcons
          name={HazardTypeMap[hazard].icon}
          size={18}
          color={HazardTypeMap[hazard].color}
        />
      ),
    };
  });

  //---date time dropdown---//
  const showDatePicker = () => {
    setDatePickerVisible(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisible(false);
  };

  const handleConfirm = (date: Date) => {
    setSelectedDate(date);
    hideDatePicker();
  };

  //---execute (submit)---//
  const handleCheckHazards = async () => {
    setLoading(true);
    try {
      //---checking---//
      // console.log("Region:", selectedRegion);
      // console.log("Hazard:", selectedHazard);
      // console.log("Date:", selectedDate);

      //---fetch trafficHazard from api---//
      const features = await NswTransportService.fetchTrafficHazardApi(
        selectedRegion,
        selectedHazard,
        selectedDate,
      );

      //---when no hazards returned---//
      if (!features || features.length === 0) {
        Alert.alert(
          "No Data",
          `No ${
            HazardTypeMap[selectedHazard].label
          } hazards found in ${selectedRegion}.`,
        );
        return;
      }

      //---navigate to trafficHazardListUI---//
      navigation.navigate("HazardList", {
        hazards: features,
        fromStorage: false,
      });
    } catch (err) {
      console.error("Fetch failed:", err);
      Alert.alert("Error", "Failed to connect to TfNSW. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* ---header--- */}
        <Text style={styles.headerTitle}>NSW Traffic Hazard</Text>
        <Text style={styles.headerSubtitle}>Real-time traffic updates</Text>

        <View style={styles.cardContainer}>
          {/* ---saved hazard to storage--- */}
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              console.log("Saved Hazards pressed");
              if (hazards.length > 0) {
                navigation.navigate("HazardList", {
                  hazards,
                  fromStorage: true,
                });
              } else {
                Alert.alert("No Saved Data", "No stored hazards found.");
              }
            }}
          >
            <MaterialIcons name="save" size={28} color="#1976D2" />
            <Text style={styles.cardTitle}>My Incidents</Text>
            <Text style={styles.cardSubtitle}>
              {hazards.length} items stored
            </Text>
          </TouchableOpacity>

          {/* ---clear hazard storage--- */}
          <TouchableOpacity
            style={styles.card}
            onPress={async () => {
              try {
                await StorageService.clearAll();
                const updated = await StorageService.loadHazard();
                setHazards(updated);
                Alert.alert("Success", "All saved hazards cleared");
              } catch (error) {
                console.log("Clear error:", error);
                Alert.alert("Error", "Failed to clear storage.");
              }
            }}
          >
            <MaterialIcons name="history" size={28} color="#388E3C" />
            <Text style={styles.cardTitle}>Quick Clear</Text>
            <Text style={styles.cardSubtitle}>Clear my incident</Text>
          </TouchableOpacity>
        </View>

        {/* ---region dropdown--- */}
        <View style={[styles.inputGroup, { zIndex: 3000 }]}>
          <Text style={styles.label}>NSW Region</Text>
          <DropDownPicker
            open={regionOpen}
            value={selectedRegion}
            items={regionItems}
            setOpen={setRegionOpen}
            setValue={setSelectedRegion}
            listMode="SCROLLVIEW"
            autoScroll={true}
            dropDownContainerStyle={[styles.dropdownList, { zIndex: 3000 }]}
            style={styles.dropdown}
            placeholder="Select Region"
            onOpen={() => setHazardOpen(false)}
          />
        </View>

        {/* ---hazard dropdown--- */}
        <View style={[styles.inputGroup, { zIndex: 2000 }]}>
          <Text style={styles.label}>Hazard Type</Text>
          <DropDownPicker
            open={hazardOpen}
            value={selectedHazard}
            items={hazardItems}
            setOpen={setHazardOpen}
            setValue={setSelectedHazard}
            style={styles.dropdown}
            listMode="SCROLLVIEW"
            autoScroll={true}
            dropDownContainerStyle={[styles.dropdownList, { zIndex: 3000 }]}
            placeholder="Select Hazard"
            onOpen={() => setRegionOpen(false)} // Close other dropdown if this opens
          />
        </View>

        {/* ---date time picker--- */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Select Date & Time</Text>

          <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
            <Text style={styles.dateText}>{selectedDate.toLocaleString()}</Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </View>

        {/* ---submit button--- */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleCheckHazards}
          disabled={loading}
        >
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.buttonText}>Check Hazards</Text>}
        </TouchableOpacity>
      </View>
    </View>
  );
};
