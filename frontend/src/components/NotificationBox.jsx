/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import {
    Text, Box, HStack, VStack, Spacer, Icon, Avatar, Stack, Heading,
  } from 'native-base';
  import React from 'react';
  import { Entypo } from '@expo/vector-icons';
  import { View, useWindowDimensions } from 'react-native';
  import CardSensors from './CardSensors';

function NotificationBox({ item }) {
  return (
    <Box 
      borderBottomWidth='2'
      _dark={{
        borderColor: '#18181b',
        backgroundColor: '#2d2d30',
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: 'gray.50',
      }}
    >
      <HStack
        space={[2, 3]}
        justifyContent='space-between'
      >
        <VStack>
          <Text>
            {item.plant_id}
          </Text>
          <Text>
            {item.text}
          </Text>
        </VStack>
        <Spacer />
        <Text>
          {item.timestamp}
        </Text>
      </HStack>
    </Box>
  );
}

export default NotificationBox;
