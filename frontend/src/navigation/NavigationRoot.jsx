import React, { useState, useEffect, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import {
  NavigationContainer, DefaultTheme,
} from '@react-navigation/native';
import { Center, useColorModeValue } from 'native-base';
import { ActivityIndicator, Platform } from 'react-native';
import * as Device from 'expo-device';
import Navigation from './BottomTabNavigation';
import ProfileScreen from '../screens/AuthScreens/ProfileScreen';
import RegistrationScreen from '../screens/AuthScreens/RegistrationScreen';
import LoginScreen from '../screens/AuthScreens/LoginScreen';
import ForgotPasswordScreen from '../screens/AuthScreens/ForgotPasswordScreen';
import AuthUtils from '../api/utils/AuthUtils';
import { loadState, saveState } from '../utils/localStorage'; // Import the utility functions
import API from '../api/API';
import * as Notifications from 'expo-notifications';
import { setNavigationRef } from '../api/utils/AuthErrorHandler';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
    console.log('existingStatus', existingStatus);
  }
  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    console.log('finalStatus', finalStatus);
    return;
  }
  token = (await Notifications.getExpoPushTokenAsync()).data;
  console.log(token);

  return token;
}

const Stack = createStackNavigator();
function NavigationRoot() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navigationRef = useRef(null);

  const handleStateChange = (state) => {
    if (Device.brand == null) {
      saveState('navState', state);
    }
  };

  const initialState = loadState('navState');

  const linking = {
    prefixes: ['myapp://', 'https://myapp.com'],
    config: {
      screens: {
        Profile: 'profile',
        LoginScreen: 'login',
        Registration: 'register',
        ForgotPassword: 'forgot-password',
        Navigation: {
          path: '',
          screens: {
            Plants: 'plants',
            'Plant Profiles': 'plant-profiles',
            Devices: 'devices',
            Notifications: 'notifications',
          },
        },
      },
    },
  };

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

  //const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    AuthUtils.isUserAuthenticated().then((isLoggedIn) => {
      setIsUserLoggedIn(isLoggedIn);
      setIsLoading(false);
    });

    if ((Platform.OS !== 'web') && (isUserLoggedIn)) {
      registerForPushNotificationsAsync().then((token) => {
        API.registerPushToken({ token });
      });

      notificationListener.current =
        Notifications.addNotificationReceivedListener((notification) => {
          setNotification(notification);
        });

      responseListener.current =
        Notifications.addNotificationResponseReceivedListener((response) => {
          console.log(response);
          navigationRef.current.navigate('Notifications');
        });

      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }
  }, []);

  if (isLoading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" color="#4da707" />
      </Center>
    );
  }
  return (
    <NavigationContainer
      theme={reactNavigationTheme}
      linking={linking}
      ref={navigationRef}
      initialState={initialState}
      onStateChange={handleStateChange}
    >
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
