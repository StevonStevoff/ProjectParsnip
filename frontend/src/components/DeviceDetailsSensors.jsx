/* eslint-disable react/destructuring-assignment */
import {
  HStack, Box, Heading, Icon, Text, IconButton,
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
      {sensors.sensors.map((sensor) => (
        <HStack justifyContent="space-between">
          <HStack justifyContent="space-evenly" space={2}>
            <Box alignSelf="center" key={sensor.id}>
              {getIconComponent(sensor.description)}
            </Box>
            <Text>{sensor.name}</Text>
            <Text>{sensor.description}</Text>
          </HStack>
          <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
        </HStack>
      ))}
    </HStack>
  );
}

export default CardSensors;
