import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { DevicesScreen } from "./DevicesScreen";
import { StackActions } from '@react-navigation/native';

const Stack = createStackNavigator();
export function DevicesDetailsStackNavigation() {
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
        <Stack.Screen name="DevicesRoot" component={DevicesScreen} />
      </Stack.Navigator>
  );
}
