import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import DevicesScreen from './DevicesScreen';
import DevicesDetailsScreen from './DevicesDetailsScreen';
import DeviceEditScreen from './DeviceEditScreen';

const Stack = createStackNavigator();
function DevicesDetailsStackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="devices-home" component={DevicesScreen} />
      <Stack.Screen name="device-details" component={DevicesDetailsScreen} />
      <Stack.Screen name="device-edit" component={DeviceEditScreen} />
    </Stack.Navigator>
  );
}

export default DevicesDetailsStackNavigation;
