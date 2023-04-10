/* eslint-disable react/destructuring-assignment */
import {
  HStack, Box, Heading, Icon,
} from 'native-base';
import React from 'react';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

function CardSensors(sensors) {
  const keywordToIconComponent = {
    temperature: (
      <Icon as={FontAwesome5} name="thermometer-half" size="5" />
    ),
    humidity: (
      <Icon as={MaterialCommunityIcons} name="water-percent" size="30" />
    ),
    'soil moisture': (
      <Icon as={Ionicons} name="water-outline" size="6" />
    ),
    light: (
      <Icon as={MaterialCommunityIcons} name="weather-sunny" size="8" />
    ),
  };
  const getIconComponent = (description) => {
    const descriptionLower = description.toLowerCase();
    const keywords = Object.keys(keywordToIconComponent);
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < keywords.length; i++) {
      const keyword = keywords[i];
      if (descriptionLower.includes(keyword)) {
        return keywordToIconComponent[keyword];
      }
    }
    return null;
  };
  return (
    <HStack space={2} alignItems="center">
      <Heading size="sm" ml="-1">Sensors</Heading>
      {sensors.sensors.map((sensor) => (
        <Box alignSelf="center" key={sensor.id}>
          {getIconComponent(sensor.description)}
        </Box>
      ))}
    </HStack>
  );
}

export default CardSensors;
