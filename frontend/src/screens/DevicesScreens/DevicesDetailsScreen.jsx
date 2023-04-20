/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import React, { useState, useEffect } from 'react';
import {
  Text, Box, Heading, HStack, VStack,
  Icon, Button, ScrollView, Center,
} from 'native-base';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import DeviceUtils from '../../api/utils/DeviceUtils';
import DeviceDetailsInfo from '../../components/DeviceDetailsInfo';
import PlantInfoTable from '../../components/PlantInfoTable';

function DevicesDetailsScreen({ navigation, route }) {
  const { item } = route.params;
  const isFocused = useIsFocused();

  const [currentDevice, setCurrentDevice] = useState((item && item.device) || item || {});
  currentDevice.isLinked = !!item.device;

  const [isLoading, setIsLoading] = useState(false);
  const [deviceSensors, setDeviceSensors] = useState(currentDevice.sensors || []);
  const [deviceUsers, setDeviceUsers] = useState(currentDevice.users || []);

  const {
    name = '',
    model_name = '',
  } = currentDevice;

  const addUsersOwnerFlag = () => {
    if (currentDevice.name) {
      deviceUsers.map((user) => {
        if (user.id === currentDevice.owner.id) {
          // eslint-disable-next-line no-param-reassign
          user.isOwner = true;
        }
        return user;
      });
    }
  };

  const updateDevice = async () => {
    if (currentDevice.isUserOwner) {
      currentDevice.sensors = deviceSensors;
      currentDevice.users = deviceUsers;
      await DeviceUtils.updateDevice(currentDevice);
    }
  };

  useEffect(() => {
    addUsersOwnerFlag();
  }, []);

  useEffect(() => {
    if (currentDevice.isUserOwner) {
      updateDevice();
    }
  }, [deviceSensors, deviceUsers]);

  if (isLoading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" color="#4da707" />
      </Center>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: '5%',
      }}
    >
      <Box
        width="100%"
        minWidth="100%"
        rounded="sm"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{ borderColor: '#18181b', backgroundColor: '#18181b' }}
        _light={{ backgroundColor: 'gray.50' }}
      >
        <VStack width="90%" space={4}>
          <HStack justifyContent="space-between" width="100%">
            <Button
              onPress={() => navigation.goBack()}
              variant="unstyled"
            >
              <Icon
                as={Ionicons}
                name="arrow-back"
                _dark={{ color: 'white' }}
                _light={{ color: 'grey.200' }}
                size="lg"
              />
            </Button>
            {currentDevice.isUserOwner && (
            <Button
              variant="unstyled"
              onPress={() => navigation.navigate('device-edit', { device: currentDevice, editDevice: setCurrentDevice })}
            >
              <Icon
                as={FontAwesome}
                name="pencil-square-o"
                _dark={{ color: 'white' }}
                _light={{ color: 'grey.200' }}
                size="lg"
              />
            </Button>
            )}
          </HStack>
          <VStack height="7%">
            <Heading size="xl" fontWeight={500} textAlign="center">{name}</Heading>
            <Text
              textAlign="center"
              color="gray.100"
              fontSize={14}
              fontWeight="semibold"
            >
              {model_name}
            </Text>
          </VStack>
          <PlantInfoTable
            plantProfileName={item?.plant_profile?.name || ''}
            plantType={item?.plant_type?.name || ''}
            plantName={item?.name || ''}
          />
          <DeviceDetailsInfo heading="Sensors" isUserOwner={currentDevice.isUserOwner} items={deviceSensors} setItems={setDeviceSensors} fetchSelectionOptions={DeviceUtils.getAllSensors} />
          <DeviceDetailsInfo heading="Users" isUserOwner={currentDevice.isUserOwner} items={deviceUsers} setItems={setDeviceUsers} fetchSelectionOptions={DeviceUtils.getAllUsers} />
        </VStack>
      </Box>
    </ScrollView>
  );
}

export default DevicesDetailsScreen;
