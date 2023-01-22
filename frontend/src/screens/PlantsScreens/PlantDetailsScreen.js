import {Text, View } from 'react-native'
import React from 'react'
import { useTheme } from "@react-navigation/native"; 

export function PlantDetailsScreen({route, navigation}){
  const { colors } = useTheme();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={colors.textFormat}>PlantProfileScreen</Text>
    <Text style={colors.textFormat}>{route.params.itemID}</Text>
    
  </View>
  )
}