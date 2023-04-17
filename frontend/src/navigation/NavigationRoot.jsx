import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { Center, useColorModeValue } from 'native-base';
import { ActivityIndicator } from 'react-native';
import Navigation from './BottomTabNavigation';
import ProfileScreen from '../screens/AuthScreens/ProfileScreen';
import RegistrationScreen from '../screens/AuthScreens/RegistrationScreen';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import ForgotPasswordScreen from '../screens/AuthScreens/ForgotPasswordScreen';
import AuthUtils from '../api/utils/AuthUtils';

const Stack = createStackNavigator();
function NavigationRoot() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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

  useEffect(() => {
    AuthUtils.isUserAuthenticated().then((isLoggedIn) => {
      setIsUserLoggedIn(isLoggedIn);
      setIsLoading(false);
    });
  }, []);
  if (isLoading) {
    return <Center flex={1}><ActivityIndicator size="large" /></Center>;
  }
  return (
    <NavigationContainer theme={reactNavigationTheme}>
      <Stack.Navigator
        initialRouteName={isUserLoggedIn ? 'Navigation' : 'LoginScreen'}
        screenOptions={{
          headerShown: false,
        }}
      >
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
