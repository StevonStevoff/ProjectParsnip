/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { useWindowDimensions } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '@react-navigation/native';
import Header from './Header';
import PlantsStackNavigation from '../../screens/PlantsScreens/PlantsStackNavigation';
import PlantProfileStackNavigation from '../../screens/PlantProfileScreens/PlantProfilesStackNavigation';
import DevicesDetailsStackNavigation from '../../screens/DevicesScreens/DeviceStackNavigation';
import NotificationsScreen from '../../screens/SettingScreens/NotificationsScreen';

function Navigation() {
  const { colors } = useTheme();
  const dimensions = useWindowDimensions();
  const isLargeScreen = dimensions.width >= 760;
  const Tab = isLargeScreen
    ? createDrawerNavigator()
    : createBottomTabNavigator();

  return (
    <Tab.Navigator
      // defaultStatus='open'
      barStyle={{
        backgroundColor: '#ffff',
        borderRadius: 5,
      }}
      screenOptions={{
        headerTintColor: colors.text,
        headerTitle: () => <Header />,
        drawerStyle: isLargeScreen ? { width: '22%' } : { width: '90%' },
        drawerType: 'back',
        tabBarInactiveTintColor: colors.iconColor,
      }}
    >
      <Tab.Screen
        name="Plants"
        component={PlantsStackNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="flower" color={color} size={26} />
          ),
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons name="flower" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Plant Profiles"
        component={PlantProfileStackNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="book-cog-outline"
              color={color}
              size={26}
            />
          ),
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="book-cog-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Devices"
        component={DevicesDetailsStackNavigation}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="cellphone-link"
              color={color}
              size={26}
            />
          ),
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="cellphone-link"
              color={color}
              size={26}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="bell-outline"
              color={color}
              size={26}
            />
          ),
          drawerIcon: ({ color }) => (
            <MaterialCommunityIcons
              name="bell-outline"
              color={color}
              size={26}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default Navigation;
