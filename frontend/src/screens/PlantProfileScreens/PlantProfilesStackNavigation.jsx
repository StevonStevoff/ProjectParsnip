import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import PlantProfileScreen from './PlantProfileScreen';

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
      <Stack.Screen name="profiles" component={PlantProfileScreen} />
    </Stack.Navigator>
  );
}

export default PlantProfileStackNavigation;
