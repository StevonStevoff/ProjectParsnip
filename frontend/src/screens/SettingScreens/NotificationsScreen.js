import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from "@react-navigation/native"; 
export function NotificationsScreen(){
  const { colors } = useTheme();
    return (
      <View>
        <Text style={colors.textFormat}> NotificationsScreen </Text>
      </View>
    );
}
