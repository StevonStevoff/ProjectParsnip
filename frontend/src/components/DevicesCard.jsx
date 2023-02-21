import {
  Text, Box, HStack, Icon, Avatar, Stack, Heading,
} from 'native-base';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { View } from 'react-native';
import SoilMoistureIcon from './icons/SoilMoistureIcon';
import DewIcon from './icons/DewIcon';
import TempIcon from './icons/TempIcon';
import LightIcon from './icons/LightIcon';

function DevicesCard() {
  return (
    <View style={{
      flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%',
    }}
    >
      <Box
        maxW="80"
        width="100%"
        rounded="lg"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{
          borderColor: 'coolGray.600',
          backgroundColor: 'gray.700',
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: 'gray.50',
        }}
      >
        <Stack p="4" space={3}>
          <Stack space={2}>
            <HStack space={8} alignItems="center">
              <Heading size="sm" ml="-1">
                Back Garden Pepper Patch
              </Heading>
              <Avatar.Group
                _avatar={{
                  size: 'sm',
                }}
                max={3}
              >
                <Avatar
                  bg="green.500"
                  source={{
                    uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=687&q=80',
                  }}
                />
                <Avatar
                  bg="cyan.500"
                  source={{
                    uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
                  }}
                />

              </Avatar.Group>
            </HStack>
            <HStack space={3}>
              <Text
                fontSize={10}
                _light={{
                  color: 'primary.500',
                }}
                _dark={{
                  color: 'primary.400',
                }}
                fontWeight="500"
              >
                E8051 Series
              </Text>
              <Icon
                as={Entypo}
                name="dot-single"
              />
              <Text
                fontSize={10}
                noOfLines={1}
                _light={{
                  color: 'primary.500',
                }}
                _dark={{
                  color: 'primary.400',
                }}
                fontWeight="500"
              >
                Pepper Plant
              </Text>
              <Icon
                as={Entypo}
                name="dot-single"
              />
              <Text
                fontSize={10}
                _light={{
                  color: 'primary.500',
                }}
                _dark={{
                  color: 'primary.400',
                }}
              >
                Pepper Profile
              </Text>
            </HStack>
          </Stack>
          <HStack space={3} alignItems="center">
            <Heading size="sm" ml="-1">Sensors</Heading>
            <Box alignSelf="center">
              <DewIcon />
            </Box>
            <Box alignSelf="center">
              <SoilMoistureIcon />
            </Box>
            <Box alignSelf="center">
              <TempIcon />
            </Box>
            <Box alignSelf="center">
              <LightIcon />
            </Box>
          </HStack>
        </Stack>
      </Box>
    </View>
  );
}

export default DevicesCard;
