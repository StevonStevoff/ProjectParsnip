import React from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';

function NotificationsScreen() {
  const { colors } = useTheme();
  return (
    <View>
      <Text style={colors.textFormat}> NotificationsScreen </Text>
    </View>
  );
}

export default NotificationsScreen;
