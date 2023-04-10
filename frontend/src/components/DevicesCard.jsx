/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import {
  Text, Box, HStack, Icon, Avatar, Stack, Heading,
} from 'native-base';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { View, useWindowDimensions } from 'react-native';
import CardSensors from './CardSensors';

function DevicesCard(device) {
  const { width, height } = useWindowDimensions();
  const {
    name, model_name, users, sensors,
  } = device.device;
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width > 768 ? 350 : 250,
        height: height > 1024 ? 240 : 200,
      }}
    >
      <Box
        width="90%"
        height="90%"
        rounded="lg"
        paddingBottom={2}
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
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
        <Stack p="4" space={3}>
          <Stack space={2}>
            <HStack
              space={7}
              alignItems="center"
              justifyContent="space-between"
            >
              <Heading size="sm" ml="-1">
                {name}
              </Heading>
              <Avatar.Group
                _avatar={{
                  size: 'sm',
                }}
                max={3}
              >
                {users.map((user) => (
                  <Avatar
                    key={user.id}
                    source={{
                      uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80',
                    }}
                  />
                ))}
              </Avatar.Group>
            </HStack>
            <HStack space={3}>
              <Text
                fontSize={11}
                _light={{
                  color: 'primary.500',
                }}
                _dark={{
                  color: 'primary.400',
                }}
                fontWeight="500"
              >
                {model_name}
              </Text>
              <Icon as={Entypo} name="dot-single" />
              <Text
                fontSize={11}
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
              <Icon as={Entypo} name="dot-single" />
              <Text
                fontSize={11}
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
            <CardSensors sensors={sensors} />
          </Stack>
        </Stack>
      </Box>
    </View>
  );
}

export default DevicesCard;