import { Text, View, TouchableOpacity, Button } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthUtils } from "../../api/utils/AuthUtils";
import { useTheme } from '@react-navigation/native';

export function ProfileScreen({navigation}) {
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={colors.textFormat}>Profile Screen</Text>
      <TouchableOpacity
      onPress={()=>{
        navigation.goBack()
      }}
      >
      <MaterialCommunityIcons
                name="close"
                color={colors.text}
                size={26}
              />
      </TouchableOpacity>
      <Button
      title='Logout'
      onPress={()=> {AuthUtils.logout(navigation)}}
      />
    </View>
  );
}
