import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DevicesScreen from './DevicesScreen';
import DevicesDetailsScreen from './DevicesDetailsScreen';

const Stack = createStackNavigator();
function DevicesDetailsStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="DevicesRoot" component={DevicesScreen} />
      <Stack.Screen name="DevicesDetails" component={DevicesDetailsScreen} />
    </Stack.Navigator>
  );
}

export default DevicesDetailsStackNavigation;
