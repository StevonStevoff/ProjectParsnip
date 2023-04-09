import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { StackActions } from '@react-navigation/native';
import PlantsScreen from './PlantsScreen';
import PlantDetailsScreen from './PlantDetailsScreen';
import RegisterPlantScreen from './RegisterPlantScreen';
import EditPlantScreen from './EditPlantScreen';

const Stack = createStackNavigator();

function PlantsStackNavigation() {
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
      <Stack.Screen name="PlantsRoot" component={PlantsScreen} />
      <Stack.Screen name="RegisterPlantScreen" component={RegisterPlantScreen} />
      <Stack.Screen name="EditPlantScreen" component={EditPlantScreen} />
      <Stack.Screen name="PlantDetails" component={PlantDetailsScreen} />
    </Stack.Navigator>
  );
}

export default PlantsStackNavigation;
