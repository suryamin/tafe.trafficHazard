//---------------------------------------------------//
// created: 25/02/2026                               //
// updated: 26/02/2026                               //
// by     : suryamin                                 //
// note   : tafe project assignment                  //
// program: App.tsx                                  //
//---------------------------------------------------//

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
//------------------------------------------------------------//
import { HomeScreen } from "./HomeUI";
import { TrafficHazardList } from "./ui/TrafficHazardListUI";
import { TrafficHazardDetail } from "./ui/TrafficHazardDetailUI";
import { TrafficHazardFeature } from "./models/trafficHazardFeatureModel";
//------------------------------------------------------------//

export type RootStackParamList = {
  Home: undefined;
  HazardList: {
    hazards: TrafficHazardFeature[];
    fromStorage?: boolean;
  };
  HazardDetail: { hazard: TrafficHazardFeature };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#fff" },
          headerTitleStyle: { fontWeight: "bold" },
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "NSW Traffic Hazard" }}
        />
        <Stack.Screen
          name="HazardList"
          component={TrafficHazardList}
          options={({ route }) => ({
            title: route.params?.fromStorage ? "My Incidents" : "Hazard List",
          })}
        />
        <Stack.Screen
          name="HazardDetail"
          component={TrafficHazardDetail}
          options={{
            title: "Hazard Detail",
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
