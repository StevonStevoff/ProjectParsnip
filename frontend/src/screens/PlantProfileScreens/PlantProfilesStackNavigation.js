import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { PlantProfileScreen } from "./PlantProfileScreen";
import { StackActions } from "@react-navigation/native";
const Stack = createStackNavigator();

export function PlantProfileStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      screenListeners={({ navigation }) => {
        navigation.getParent().addListener("tabPress", (e) => {
          if (navigation.getState().index != 0) {
            navigation.dispatch(StackActions.popToTop());
          }
        });
      }}
    >
      <Stack.Screen name="PlantProfile" component={PlantProfileScreen} />
    </Stack.Navigator>
  );
}
