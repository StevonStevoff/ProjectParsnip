import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import PlantProfileScreen from './PlantProfileScreen';
import EditPlantProfileScreen from './EditPlantProfileScreen';

const Stack = createStackNavigator();

function PlantProfileStackNavigation() {
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
      <Stack.Screen name="PlantProfile" component={PlantProfileScreen} />
      <Stack.Screen name="EditPlantProfileScreen" component={EditPlantProfileScreen} />
    </Stack.Navigator>
  );
}

export default PlantProfileStackNavigation;
