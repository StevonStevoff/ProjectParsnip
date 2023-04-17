/* eslint-disable no-param-reassign */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import {
  Input, Icon, FormControl, VStack, Select, CheckIcon, Button,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import DeviceUtils from '../api/utils/DeviceUtils';
import DeviceSchema from '../utils/validationSchema/DeviceSchema';

function DeviceEditForm({ navigation, device }) {
  const [isFormLoading, setIsLoading] = useState(false);
  const [ownerID, setOwnerId] = useState(device.owner.id || '');
  const [deviceName, setDeviceName] = useState(device.name || '');

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const handleDeviceEdit = async () => {
    setIsLoading(true);
    device.owner.id = ownerID;
    device.name = deviceName;
    try {
      const response = await DeviceUtils.updateDevice(device);
      if (response.status === 200) {
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
          owner: device.owner?.id || '',
        }}
        validationSchema={DeviceSchema}
        onSubmit={handleDeviceEdit}
      >
        {({
          errors,
          touched,
          handleBlur,
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
                onChangeText={(text) => setDeviceName(text)}
                onBlur={handleBlur('name')}
                value={deviceName}
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
                selectedValue={ownerID}
                onValueChange={(itemValue) => setOwnerId(itemValue)}
              >
                {device.users.map((user) => (
                  <Select.Item key={user.id} label={user.username} value={user.id} />
                ))}
              </Select>
            </FormControl>
            <Button w="40%" onPress={handleDeviceEdit}> Update Device </Button>
          </VStack>
        )}
      </Formik>
    </View>
  );
}

export default DeviceEditForm;
