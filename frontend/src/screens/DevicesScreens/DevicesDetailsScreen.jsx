/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import {
  Text, Box, Heading, HStack, VStack, IconButton,
  Icon, Avatar, Button, Divider, ScrollView,
} from 'native-base';
import React, { useState, useEffect } from 'react';
import { MaterialCommunityIcons, MaterialIcons, Ionicons } from '@expo/vector-icons';
import DevicesDetailsSensors from '../../components/DeviceDetailsSensors';
import DeviceUtils from '../../api/utils/DeviceUtils';
import AdditionDialog from '../../components/AdditionDialog';

function DevicesDetailsScreen({ navigation, route }) {
  const [sensortoAdd, setSensorToAdd] = useState(null);
  const [additionDialogOpen, setAdditionDialogOpen] = useState(false);
  const [selectionOptions, setSelectionOptions] = useState([]);
  const { device = {}, plant = {} } = route?.params || {};
  const [deviceSensors, setDeviceSensors] = useState([]);
  const [allSensors, setAllSensors] = useState([]);

  const {
    name = '',
    model_name = '',
    users = [],
    sensors = [],
  } = (device && Object.keys(device).length > 0) ? device : (plant && plant.device) || {};

  const plantName = plant?.name || '';
  const plantProfileName = plant?.plant_profile?.name || '';
  const plantType = plant?.plant_type?.name || '';
  const ownerID = plant?.device.owner?.id || device.owner?.id || '';
  const currentDevice = (device && Object.keys(device).length > 0)
    ? device : (plant && plant.device) || {};
  users.forEach((user) => {
    if (user.id === ownerID) {
      // eslint-disable-next-line no-param-reassign
      user.isOwner = true;
    }
  });

  useEffect(() => {
    DeviceUtils.getAllSensors()
      .then((sensorResponse) => {
        setAllSensors(sensorResponse);
        console.log('sensors', allSensors);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    setDeviceSensors(sensors);
  }, [sensors]);

  const handleSensorUpdate = async (updatedSensors) => {
    try {
      const response = await DeviceUtils.updateSensorsInDevice(currentDevice, updatedSensors);

      if (response.status === 200) {
        const updatedDevice = await response.data;
        setDeviceSensors(updatedDevice.sensors);
      } else {
        // Handle the error case (e.g., show an error message)
        console.error('Failed to update sensors:', response.statusText);
      }
    } catch (error) {
      console.error('Error updating sensors:', error);
    }
  };

  const handleAdditionClick = () => {
    setAdditionDialogOpen(true);
  };

  const handleAdditionClose = () => {
    setAdditionDialogOpen(false);
    setSelectionOptions([]);
  };

  // eslint-disable-next-line no-unused-vars
  const handleAdditionConfirm = (newSensor = null, newUser = null) => {
    const updateSensors = [...currentDevice.sensors, newSensor];
    handleSensorUpdate(updateSensors);
    handleAdditionClose();
  };

  const addSensorsClick = () => {
    setSelectionOptions(allSensors);
    console.log(allSensors);
    handleAdditionClick();
  };
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
        height="100%"
        minHeight="100%"
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
        <AdditionDialog
          isOpen={additionDialogOpen}
          onClose={handleAdditionClose}
          onConfirm={handleAdditionConfirm}
          selectionOptions={selectionOptions}
          actionBtnText="Add"
        />
        <VStack width="90%">
          <HStack justifyContent="space-between" width="100%">
            <IconButton
              icon={<Icon as={Ionicons} name="arrow-back" color="white" size="lg" />}
              onPress={() => navigation.goBack()}
            />
          </HStack>
          <VStack height="10%">
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
          <VStack
            rounded="lg"
            justifyContent="center"
            width="100%"
            p={5}
          >
            <HStack justifyContent="space-between" space={2}>
              <Heading size="lg" fontWeight={500}>Linked Plant</Heading>
              <Button
                bg="error.600"
                _hover={{ bg: 'error.700' }}
                size="sm"
                marginBottom={1}
              >
                Unlink
              </Button>
            </HStack>
            <Divider />
            <VStack justifyContent="space-between" p={3}>
              <HStack justifyContent="space-between">
                <Text>
                  {plantName}

                </Text>
                <Text>{plantProfileName}</Text>
                <Text>{plantType}</Text>
              </HStack>
            </VStack>
          </VStack>
          <VStack
            rounded="lg"
            justifyContent="center"
            width="100%"
            p={5}
          >
            <HStack justifyContent="space-between">
              <Heading size="lg" fontWeight={500}>Sensors</Heading>
              <Button
                variant="unstyled"
                onPress={() => addSensorsClick()}
              >
                <Icon
                  as={MaterialIcons}
                  name="add-circle"
                  size="lg"
                  _light={{ color: 'grey.200' }}
                  _dark={{ color: 'white' }}
                />
              </Button>
            </HStack>
            <Divider />
            <DevicesDetailsSensors
              sensors={deviceSensors}
              handleSensorUpdate={handleSensorUpdate}
            />
          </VStack>
          <VStack
            rounded="lg"
            justifyContent="center"
            width="100%"
            p={5}
            space={2}
          >
            <HStack justifyContent="space-between">
              <Heading size="lg" fontWeight={500}>Users</Heading>
              <IconButton icon={(
                <Icon
                  as={MaterialIcons}
                  name="add-circle"
                  size="lg"
                  _light={{ color: 'grey.200' }}
                  _dark={{ color: 'white' }}
                />
)}
              />
            </HStack>
            <Divider />
            {users.map((user) => (
              <HStack justifyContent="space-between" alignItems="center" space={3} p={2} key={user.id}>
                <HStack justifyContent="flex-start" alignItems="center" space={3}>
                  <Avatar size="md" source={{ uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80' }} />
                  <Text color="coolGray.500">
                    {user.name}
                    {' '}
                    {user.isOwner ? '(Owner)' : ''}
                  </Text>
                </HStack>
                <IconButton icon={(
                  <Icon
                    as={MaterialCommunityIcons}
                    name="close"
                    size="lg"
                    _light={{ color: 'grey.200' }}
                    _dark={{ color: 'white' }}
                  />
)}
                />
              </HStack>
            ))}
          </VStack>
        </VStack>
      </Box>
    </ScrollView>
  );
}

export default DevicesDetailsScreen;
