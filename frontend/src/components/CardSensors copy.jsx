/* eslint-disable react/destructuring-assignment */
import {
  HStack, Box, Heading, Icon,
} from 'native-base';
import React from 'react';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import TempIcon from './icons/TempIcon';
import DewIcon from './icons/DewIcon';
import SoilMoistureIcon from './icons/SoilMoistureIcon';
import LightIcon from './icons/LightIcon';

function CardSensors(sensors) {
  const getIconComponent = (name) => {
    switch (name.toLowerCase()) {
      case 'temperature':
        return (
          <Icon
            as={FontAwesome5}
            name="temperature-high"
          />
        );
      case 'humidity':
        return (
          <Icon
            as={MaterialCommunityIcons}
            name="water-percent"
          />
        );
      case 'soil moisture':
        return (
          <Icon
            as={Ionicons}
            name="water-outline"
          />
        );
      case 'light sensor':
        return (
          <Icon
            as={MaterialCommunityIcons}
            name="weather-sunny"
          />
        );

      default:
        return null;
    }
  };
  return (
    <HStack space={3} alignItems="center">
      <Heading size="sm" ml="-1">Sensors</Heading>
      {sensors.sensors.map((sensor) => (
        <Box alignSelf="center" key={sensor.id}>
          {getIconComponent(sensor.name)}
        </Box>
      ))}
    </HStack>
  );
}

export default CardSensors;
