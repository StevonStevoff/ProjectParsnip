import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import DevicesScreen from './DevicesScreen';
import DevicesDetailsScreen from './DevicesDetailsScreen';

const Stack = createStackNavigator();
function DevicesDetailsStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      screenListeners={({ navigation }) => {
        navigation.getParent().addListener('tabPress', () => {
          if (navigation.getState().index !== 0) {
            navigation.dispatch(StackActions.popToTop());
          }
        });
      }}
    >
      <Stack.Screen name="DevicesRoot" component={DevicesScreen} />
      <Stack.Screen name="DevicesDetails" component={DevicesDetailsScreen} />
    </Stack.Navigator>
  );
}

export default DevicesDetailsStackNavigation;
