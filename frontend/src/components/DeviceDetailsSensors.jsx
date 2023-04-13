import {
  HStack, VStack, Box, Icon, Text, IconButton,
} from 'native-base';
import React from 'react';
import { useWindowDimensions } from 'react-native';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

function DevicesDetailsSensors({ sensors }) {
  const screenWidth = useWindowDimensions().width;
  const keywordToIconComponent = {
    temperature: (
      <Icon as={FontAwesome5} name="thermometer-half" size="8" paddingLeft={2.5} />
    ),
    humidity: (
      <Icon as={MaterialCommunityIcons} name="water-percent" size="38" />
    ),
    'soil moisture': (
      <Icon as={Ionicons} name="water-outline" size="8" paddingLeft={0.5} />
    ),
    light: (
      <Icon as={MaterialCommunityIcons} name="weather-sunny" size="10" paddingLeft={0.5} />
    ),
  };
  const getIconComponent = (description) => {
    const descriptionLower = description.toLowerCase();
    const keywords = Object.keys(keywordToIconComponent);
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];
      if (descriptionLower.includes(keyword)) {
        return keywordToIconComponent[keyword];
      }
    }
    return null;
  };
  return (
    <VStack space={2} alignItems="stretch">
      {sensors.map((sensor) => (
        <HStack key={sensor.id} justifyContent="space-between" space={4} p={2} alignItems="center">
          <HStack space={4} minWidth="15%" alignItems="center">
            <Box alignSelf="center" backgroundColor="red">
              {getIconComponent(sensor.description)}
            </Box>
            <Text
              fontWeight="bold"
            >
              {sensor.name}
            </Text>
          </HStack>
          {screenWidth > 760 && (
          <HStack flexGrow={1} paddingLeft={2} alignItems="center">
            <Text>
              {sensor.description}
            </Text>
          </HStack>
          )}
          <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" color="white" size="lg" />} />
        </HStack>
      ))}
    </VStack>
  );
}

export default DevicesDetailsSensors;
