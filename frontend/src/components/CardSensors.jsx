/* eslint-disable react/destructuring-assignment */
import {
  HStack, Box, Heading,
} from 'native-base';
import React from 'react';
import getIconComponent from '../utils/SensorIcons';

function CardSensors(sensors) {
  return (
    <HStack space={3} alignItems="center" width="70%">
      <Heading size="sm" ml="-1">Sensors</Heading>
      <HStack space={2} width="100%" alignItems="center" justifyContent={sensors.sensors.length > 1 ? 'space-evenly' : 'space-between'}>
        {sensors.sensors.map((sensor) => (
          <Box alignSelf="center" key={sensor.id}>
            {getIconComponent(sensor.description)}
          </Box>
        ))}
      </HStack>
    </HStack>
  );
}

export default CardSensors;
