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
  const date = item.timestamp.substring(0, item.timestamp.indexOf('T'));

  return (
    <Box 
      borderBottomWidth='2'
      overflow='hidden'
      _dark={{
        borderColor: 'primary.400',
        backgroundColor: '#2d2d30',
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        borderColor: 'primary.400',
        backgroundColor: 'gray.50',
      }}
    >
      <VStack
        space={1}
        justifyContent='space-between'
        padding={2}
      >
        <HStack>
          <Text
            fontSize={15}
            fontWeight='700'
            _light={{
              color: 'primary.950',
            }}
            _dark={{
              color: 'primary.500',
            }}
          >
            {item.plant.name}
          </Text>
          <Spacer />
          <Text 
            _light={{
              color: 'gray.500'
            }}
            _dark={{
              color: 'gray.100'
            }}
          >
            {date}
          </Text>
        </HStack>
        <Text>
          {item.text}
        </Text>
      </VStack>
    </Box>
  );
}

export default NotificationBox;
