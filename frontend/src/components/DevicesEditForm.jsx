/* eslint-disable no-param-reassign */

import React, { useState } from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import {
  Input, Icon, FormControl, VStack, Select, Button, Center, Heading, Spacer,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DeviceUtils from '../api/utils/DeviceUtils';
import DeviceSchema from '../utils/validationSchema/DeviceSchema';
import WarningDialog from './WarningDialog';

function DeviceEditForm({ navigation, device, editDevice }) {
  const [isFormLoading, setIsLoading] = useState(false);
  const [deviceOwner, setDeviceOwner] = useState(device.owner);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  const handleDeviceEdit = async (values) => {
    setIsLoading(true);
    device.isUserOwner = false;
    device.owner = deviceOwner;
    device.name = values.name;
    editDevice(device);
    try {
      const [response, currentUser] = await Promise.all([
        DeviceUtils.updateDevice(device),
        DeviceUtils.getCurrentUser(),
      ]);

      if (response.status === 200) {
        if (deviceOwner.id === currentUser.id) {
          device.isUserOwner = true;
        }
        navigation.goBack();
      } else {
        console.error('Failed to edit device:', response.statusText);
      }
    } catch (error) {
      console.error('Error editing device:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClose = () => {
    setIsWarningDialogOpen(false);
  };

  const handleDeleteConfirm = () => {
    setIsWarningDialogOpen(false);
    setIsLoading(true);
    DeviceUtils.deleteDevice(device)
      .then((response) => {
        if (response.status === 200) {
          navigation.navigate('devices-home');
        } else {
          console.error('Failed to delete device:', response.statusText);
        }
      })
      .catch((error) => {
        console.error('Error deleting device:', error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  if (isFormLoading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" color="#4da707" />
      </Center>
    );
  }

  return (
    <VStack
      style={{
        flex: 1,
        width: '90%',
      }}
      space={8}
      alignItems="center"
    >
      <WarningDialog
        isOpen={isWarningDialogOpen}
        onClose={handleDeleteClose}
        onConfirm={handleDeleteConfirm}
        warningMessage="Are you sure you want to delete this device? This action cannot be undone."
        actionBtnText="Delete Device"
      />

      <Heading>
        {' '}
        Editing
        {' '}
        {device.name}
      </Heading>
      <Formik
        initialValues={{
          name: device.name || '',
          owner: deviceOwner,
        }}
        validationSchema={DeviceSchema}
        onSubmit={handleDeviceEdit}
      >
        {({
          errors,
          touched,
          handleBlur,
          handleChange,
          values,
        }) => (
          <VStack alignItems="center" width="90%">
            <FormControl isRequired isInvalid={errors.name && touched.name}>
              <FormControl.Label>Device Name</FormControl.Label>
              <Input
                w="100%"
                size="2xl"
                marginBottom="2%"
                testID="name-input"
                InputLeftElement={<Icon as={<MaterialIcons name="devices" />} size={5} ml="2" color="muted.400" />}
                placeholder="Device name"
                variant="filled"
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
              />
              <FormControl.ErrorMessage>
                {errors.name}
              </FormControl.ErrorMessage>
            </FormControl>
            <FormControl isRequired isInvalid={errors.owner && touched.owner}>
              <FormControl.Label>Device Owner</FormControl.Label>
              <Select
                w="100%"
                size="2xl"
                marginBottom="2%"
                testID="owner-select"
                InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="muted.400" />}
                placeholder="Select owner"
                variant="filled"
                selectedValue={deviceOwner?.id}
                onValueChange={(value) => {
                  const owner = device.users.find((user) => user.id === +value);
                  setDeviceOwner(owner);
                }}
              >
                {device.users.map((user) => (
                  <Select.Item
                    key={user.id}
                    label={user.username}
                    value={user.id}
                  />
                ))}
              </Select>
            </FormControl>
            <VStack alignItems="center" width="100%" space={2}>
              <Spacer size={5} />
              <Button w="40%" onPress={() => handleDeviceEdit(values)}> Update Device </Button>
              {!device.isLinked && (
              <Button
                color="white"
                w="40%"
                bg="error.600"
                onPress={() => setIsWarningDialogOpen(true)}
              >
                Delete Device
              </Button>
              ) }
            </VStack>
          </VStack>
        )}
      </Formik>
    </VStack>
  );
}

export default DeviceEditForm;
