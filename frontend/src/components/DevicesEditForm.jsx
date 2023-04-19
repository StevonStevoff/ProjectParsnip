/* eslint-disable no-param-reassign */

import React, { useState } from 'react';
import {
  View,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import {
  Input, Icon, FormControl, VStack, Select, Button, Center,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DeviceUtils from '../api/utils/DeviceUtils';
import DeviceSchema from '../utils/validationSchema/DeviceSchema';

function DeviceEditForm({ navigation, device }) {
  const [isFormLoading, setIsLoading] = useState(false);
  const [deviceOwner, setDeviceOwner] = useState(device.owner);

  const handleDeviceEdit = async (values) => {
    setIsLoading(true);
    device.isUserOwner = false;
    device.owner = deviceOwner;
    device.name = values.name;
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

  if (isFormLoading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" color="#4da707" />
      </Center>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
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
            <Button w="40%" onPress={() => handleDeviceEdit(values)}> Update Device </Button>
          </VStack>
        )}
      </Formik>
    </View>
  );
}

export default DeviceEditForm;
