/* eslint-disable react/destructuring-assignment */
import {
  HStack, Box, Heading, Icon,
} from 'native-base';
import React from 'react';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

function CardSensors(sensors) {
  const getIconComponent = (name) => {
    switch (name.toLowerCase()) {
      case 'temperature':
        return (
          <Icon
            as={FontAwesome5}
            name="thermometer-half"
            size="5"
          />
        );
      case 'humidity':
        return (
          <Icon
            as={MaterialCommunityIcons}
            name="water-percent"
            size="30"
          />
        );
      case 'soil moisture':
        return (
          <Icon
            as={Ionicons}
            name="water-outline"
            size="5"
          />
        );
      case 'light sensor':
        return (
          <Icon
            as={MaterialCommunityIcons}
            name="weather-sunny"
            size="8"
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
