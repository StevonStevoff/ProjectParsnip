import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { useColorModeValue } from 'native-base';
import Navigation from './BottomTabNavigation';
import ProfileScreen from '../screens/AuthScreens/ProfileScreen';
import RegistrationScreen from '../screens/AuthScreens/RegistrationScreen';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import ForgotPasswordScreen from '../screens/AuthScreens/ForgotPasswordScreen';
import DevicesDetailsScreen from '../screens/DevicesScreens/DevicesDetailsScreen';

const Stack = createStackNavigator();
function NavigationRoot() {
  const reactNavigationTheme = {
    ...DefaultTheme,
    colors: {
      primary: '#5fbf08', // bae3cc
      // eslint-disable-next-line max-len
      background: useColorModeValue('#fff', '#18181b'), // Screen background color
      card: useColorModeValue('#fafafa', '#18181b'), // Tabs background color
      text: useColorModeValue('#1E1E1E', '#fafafa'),
      border: useColorModeValue('#fafafa', '#1c1917'),
      iconColor: useColorModeValue('#404040', '#fafafa'),
      dark: true,
    },
  };
  return (
    <NavigationContainer theme={reactNavigationTheme}>
      <Stack.Navigator
       // initialRouteName="LoginScreen"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name="DevicesDetails"
          component={DevicesDetailsScreen}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Registration"
          component={RegistrationScreen}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
        />
        <Stack.Screen
          name="Navigation"
          component={Navigation}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default NavigationRoot;
