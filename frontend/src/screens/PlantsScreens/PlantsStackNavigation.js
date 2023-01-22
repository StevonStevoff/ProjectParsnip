import { View, Text } from "react-native";

import React, {useEffect} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { PlantsScreen } from "./PlantsScreen";
import { PlantDetailsScreen } from "./PlantDetailsScreen";
import { StackActions } from '@react-navigation/native';

const Stack = createStackNavigator();

export function PlantsStackNavigation({navigation}) {

  return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        screenListeners={({navigation}) => {
          navigation.getParent().addListener('tabPress', e => {
            if (navigation.getState().index != 0) {
              navigation.dispatch(StackActions.popToTop());
            }
          });
        }}
      >
        <Stack.Screen name="PlantsRoot" component={PlantsScreen} />
        <Stack.Screen name="PlantDetails" component={PlantDetailsScreen} />
      </Stack.Navigator>
  );
}
