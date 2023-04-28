import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Formik } from 'formik';
import {
  VStack,
  HStack,
  Alert,
  IconButton,
  CloseIcon,
  Input,
  Text,
  Heading,
  Switch,
  FormControl,
  Center,
} from 'native-base';
import RegisterPlantSchema from '../utils/validationSchema/CreatePlantSchema';
import API from '../api/API';
import CustomSearchDropdown from './CustomSearchDropdown';

function CreatePlantForm(props) {
  const { plantTypes } = props;
  const { devices } = props;
  const { plantProfiles } = props;

  const statusArray = [{
    status: 'success',
    title: 'Plant successfully created!',
  }, {
    status: 'error',
    title: 'An error has occured!',
  }];
  const [event, setEvent] = useState('');

  const filteredStatusArray = statusArray.filter((status) => status.status === event);

  const handleClose = () => {
    setEvent('');
  };

  const handleRegisterPlant = async (values, { setSubmitting }) => {
    try {
      if (values.latitude === '')values.latitude = 0;
      if (values.longitude === '')values.longitude = 0;
      await API.registerPlant(values);
      setEvent('success');
    } catch (error) {
      setEvent('error');
      // handle the error
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View>

      <Formik
        initialValues={{
          name: '',
          device_id: '',
          plant_profile_id: '',
          plant_type_id: '',
          outdoor: false,
          latitude: 0,
          longitude: 0,
        }}
        validationSchema={RegisterPlantSchema}
        onSubmit={handleRegisterPlant}
      >
        {({
          handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting,
        }) => (
          <View style={styles.container}>
            {filteredStatusArray.length !== 0 && (
            <View style={{ padding: 5, width: '100%' }}>
              <Alert w="100%" status={filteredStatusArray[0].status}>
                <VStack space={2} flexShrink={1} w="100%">
                  <HStack flexShrink={1} space={2} justifyContent="space-between">
                    <HStack space={2} flexShrink={1}>
                      <Alert.Icon mt="1" />
                      <Text fontSize="md" color="coolGray.800">
                        {filteredStatusArray[0].title}
                      </Text>
                    </HStack>
                    <IconButton
                      variant="unstyled"
                      _focus={{
                        borderWidth: 0,
                      }}
                      icon={<CloseIcon size="3" />}
                      _icon={{
                        color: 'coolGray.600',
                      }}
                      onPress={handleClose}
                    />
                  </HStack>
                </VStack>
              </Alert>
            </View>
            )}

            <FormControl isRequired isInvalid={errors.name && touched.name}>
              <FormControl.Label>Name</FormControl.Label>
              <Input
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                w="100%"
                size="2xl"
                marginBottom="2%"
              />
              <FormControl.ErrorMessage>
                {errors.name}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.device_id && touched.device_id}>
              <FormControl.Label>Device</FormControl.Label>
              <View style={{ width: '100%' }}>
                <CustomSearchDropdown
                  data={devices}
                  setReturnItemId={(id) => (values.device_id = id)}
                  choosePlaceholder="Choose a device"
                  searchPlaceholder="device"
                />
              </View>
              <FormControl.ErrorMessage>
                {errors.device_id}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.plant_profile_id && touched.plant_profile_id}>
              <FormControl.Label>Plant Profile</FormControl.Label>
              <View style={{ width: '100%' }}>
                <CustomSearchDropdown
                  data={plantProfiles}
                  setReturnItemId={(id) => (values.plant_profile_id = id)}
                  choosePlaceholder="Choose a plant profile"
                  searchPlaceholder="plant profile"
                />
              </View>
              <FormControl.ErrorMessage>
                {errors.plant_profile_id}
              </FormControl.ErrorMessage>
            </FormControl>

            <FormControl isRequired isInvalid={errors.plant_type_id && touched.plant_type_id}>
              <FormControl.Label>Plant Type</FormControl.Label>
              <View style={{ width: '100%' }}>
                <CustomSearchDropdown
                  data={plantTypes}
                  setReturnItemId={(id) => (values.plant_type_id = id)}
                  choosePlaceholder="Choose a plant type"
                  searchPlaceholder="plant type"
                />
              </View>
              <FormControl.ErrorMessage>
                {errors.plant_type_id}
              </FormControl.ErrorMessage>
            </FormControl>

            <Center>
              <HStack space={2} justifyContent="center" width="80%" paddingTop={10}>
                <Heading style={{ fontSize: 16, marginRight: 15 }}>Outdoor</Heading>
                <Switch onValueChange={(value) => values.outdoor = value} size="md" />

              </HStack>
            </Center>

            <FormControl isInvalid={(errors.longitude && touched.longitude)
              || (errors.latitude && touched.latitude)}
            >
              <Center>
                <HStack space={4} justifyContent="center" width="80%" paddingTop={10}>
                  <FormControl.Label>Longitude</FormControl.Label>
                  <Input
                    onChangeText={handleChange('longitude')}
                    onBlur={handleBlur('longitude')}
                    value={values.longitude}
                    style={{ padding: 5 }}
                    w="20%"
                    size="2xl"
                    marginBottom="2%"
                  />

                  <FormControl.Label>Latitude</FormControl.Label>
                  <Input
                    onChangeText={handleChange('latitude')}
                    onBlur={handleBlur('latitude')}
                    value={values.latitude}
                    style={{ padding: 5 }}
                    w="20%"
                    size="2xl"
                    marginBottom="2%"
                  />

                </HStack>
              </Center>
              <FormControl.ErrorMessage>
                {errors.longitude}
              </FormControl.ErrorMessage>

              <FormControl.ErrorMessage>
                {errors.latitude}
              </FormControl.ErrorMessage>
            </FormControl>

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
              <Text style={styles.buttonText}>Register Plant</Text>
            </TouchableOpacity>
          </View>
        )}

      </Formik>

    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    height: '100%',
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#4caf50',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
    flexDirection: 'row',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    alignContent: 'center',
    justifyContent: 'center',
  },
});

export default CreatePlantForm;
