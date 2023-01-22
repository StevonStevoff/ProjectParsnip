import React, {useEffect} from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { Navigation } from "./BottomTabNavigation";
import { ProfileScreen } from "../../screens/AuthScreens/ProfileScreen";
import { useColorScheme } from "react-native";
import { LightTheme } from "../../stylesheets/LightTheme";
import { DarkTheme } from "../../stylesheets/DarkTheme";
import { RegistrationScreen } from "../../screens/AuthScreens/RegistrationScreen";
import { LoginScreen } from "../../screens/AuthScreens/LoginScreen";
import { ForgotPasswordScreen } from "../../screens/AuthScreens/ForgotPasswordScreen";
import { AuthUtils } from "../../api/utils/AuthUtils";
import { LoadingScreen } from "../../screens/SettingScreens/LoadingScreen";

const Stack = createStackNavigator();
export function NavigationRoot() {
  const scheme = useColorScheme();

  return (
    <NavigationContainer theme={scheme == 'dark'? DarkTheme : LightTheme}>  
      <Stack.Navigator
       initialRouteName="LoginScreen"
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
