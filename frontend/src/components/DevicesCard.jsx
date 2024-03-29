/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import {
  Text, Box, HStack, Icon, Avatar, Stack, Heading,
} from 'native-base';
import React from 'react';
import { Entypo } from '@expo/vector-icons';
import { View, useWindowDimensions } from 'react-native';
import CardSensors from './CardSensors';

function DevicesCard({ item }) {
  const { width, height } = useWindowDimensions();

  const {
    name = '', model_name = '', users = [], sensors = [],
  } = (item && (item.device || item)) || {};

  const plantName = item.device ? item.name : null;
  const plantProfileName = item.device ? item.plant_profile.name : null;

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: width > 768 ? 360 : '100%',
        height: height > 1024 ? 240 : 150,
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
                      uri: user.profile_picture_URL,
                    }}
                  />
                ))}
              </Avatar.Group>
            </HStack>
            <HStack
              justifyContent="space-evenly"
              alignItems="center"
              width="100%"
              minHeight={5}
            >
              <Text
                textAlign="center"
                fontSize={12}
                noOfLines={1}
                _light={{
                  color: 'primary.800',
                }}
                _dark={{
                  color: 'primary.400',
                }}
                fontWeight="500"
              >
                {model_name}
              </Text>
              {plantName && (
                <>
                  <Icon as={Entypo} name="dot-single" />
                  <Text
                    fontSize={12}
                    noOfLines={1}
                    _light={{
                      color: 'primary.800',
                    }}
                    _dark={{
                      color: 'primary.400',
                    }}
                    fontWeight="500"
                  >
                    {plantName}
                  </Text>
                  <Icon as={Entypo} name="dot-single" />
                  <Text
                    fontSize={12}
                    noOfLines={1}
                    _light={{
                      color: 'primary.800',
                    }}
                    _dark={{
                      color: 'primary.400',
                    }}
                  >
                    {plantProfileName}
                  </Text>
                </>
              )}
            </HStack>
            <CardSensors sensors={sensors} />
          </Stack>
        </Stack>
      </Box>
    </View>
  );
}

export default DevicesCard;
