/* eslint-disable camelcase */
/* eslint-disable react/destructuring-assignment */
import {
  Text, Box, Heading, HStack, VStack, IconButton,
  Icon, Avatar, Button, Divider, ScrollView, Center,
} from 'native-base';
import React, { useState, useEffect } from 'react';
import {
  MaterialCommunityIcons, MaterialIcons, Ionicons, FontAwesome,
} from '@expo/vector-icons';
import { ActivityIndicator } from 'react-native';
import DevicesDetailsSensors from '../../components/DeviceDetailsSensors';
import DeviceUtils from '../../api/utils/DeviceUtils';
import AdditionDialog from '../../components/AdditionDialog';
import PlantInfoTable from '../../components/PlantInfoTable';

function DevicesDetailsScreen({ navigation, route }) {
  const [isLoading, setIsLoading] = useState(true);
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
  const ownerID = (plant && plant.device && plant.device.owner && plant.device.owner.id)
    || (device && device.owner && device.owner.id)
    || '';
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
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
      });
    console.log('all sensors', allSensors);
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
    handleAdditionClick();
  };

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
        marginTop: '5%',
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
            <Button
              variant="unstyled"
              onPress={() => navigation.navigate('DeviceEdit', { device: currentDevice })}
            >
              <Icon
                as={FontAwesome}
                name="pencil-square-o"
                _dark={{ color: 'white' }}
                _light={{ color: 'grey.200' }}
                size="lg"
              />
            </Button>
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
            plantName={plantName}
            plantProfileName={plantProfileName}
            plantType={plantType}
          />
          <VStack
            rounded="lg"
            justifyContent="center"
            width="100%"
            p={4}
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
            p={4}
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
              <HStack justifyContent="space-between" alignItems="center" space={3} p={3} key={user.id}>
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
