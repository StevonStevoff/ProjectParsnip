import { View } from 'react-native';
import { Text } from 'native-base';
import React from 'react';

function PlantDetailsScreen({ route }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={colors.textFormat}>PlantProfileScreen</Text>
      <Text style={colors.textFormat}>{route.params.itemID}</Text>
    </View>
  );
}

export default PlantDetailsScreen;
