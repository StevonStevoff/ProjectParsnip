import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Appearance,
} from 'react-native';
import { Formik } from 'formik';
import {
  Heading, VStack, HStack, Alert, IconButton, CloseIcon, Input, Text, Switch,
  FormControl,
  Center,
} from 'native-base';
import { DatePickerInput } from 'react-native-paper-dates';
import { Provider as PaperProvider } from 'react-native-paper';
import EditPlantSchema from '../utils/validationSchema/EditPlantSchema';
import API from '../api/API';
import { theme, darkTheme } from '../stylesheets/paperTheme';
import CustomSearchDropdown from './CustomSearchDropdown';

function EditPlantForm(props) {
  const { plantTypes } = props;
  const { devices } = props;
  const { plantProfiles } = props;
  const { plant } = props;
  const statusArray = [{
    status: 'success',
    title: 'Plant successfully edited!',
  }, {
    status: 'error',
    title: 'An error has occured!',
  }];
  const [event, setEvent] = useState('');
  const [inputDate, setInputDate] = React.useState(undefined);

  const filteredStatusArray = statusArray.filter((status) => status.status === event);

  const colorScheme = Appearance.getColorScheme();

  const handleClose = () => {
    setEvent('');
  };

  const handleEditPlant = async (values, { setSubmitting }) => {
    try {
      if (values.latitude === '')values.latitude = 0;
      if (values.longitude === '')values.longitude = 0;

      await API.editPlant(values);
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
          id: plant.id,
          name: plant.name,
          device_id: plant.device.id.toString(),
          plant_profile_id: plant.plant_profile.id.toString(),
          plant_type_id: plant.plant_type.id.toString(),
          time_planted: plant.time_planted !== null ? new Date(plant.time_planted) : undefined,
          outdoor: plant.outdoor,
          latitude: plant.latitude !== null ? plant.latitude : 0,
          longitude: plant.longitude !== null ? plant.latitude : 0,
        }}
        validationSchema={EditPlantSchema}
        onSubmit={handleEditPlant}
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
                  choosePlaceholder={plant.device.name}
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
                  choosePlaceholder={plant.plant_profile.name}
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
                  choosePlaceholder={plant.plant_type.name}
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
                {values.outdoor ? <Switch defaultIsChecked onValueChange={(value) => values.outdoor = value} size="md" />
                  : <Switch onValueChange={(value) => values.outdoor = value} size="md" />}
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
                    value={values?.longitude?.toString()}
                    style={{ padding: 5 }}
                    w="20%"
                    size="2xl"
                    marginBottom="2%"
                  />

                  <FormControl.Label>Latitude</FormControl.Label>
                  <Input
                    onChangeText={handleChange('latitude')}
                    onBlur={handleBlur('latitude')}
                    value={values?.latitude?.toString()}
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

            <FormControl isInvalid={errors.time_planted && touched.time_planted}>
              <View style={{ width: '100%', borderRadius: 15, paddingTop: 20 }}>
                <PaperProvider theme={colorScheme === 'dark' ? darkTheme : theme} darkTheme={darkTheme}>
                  <DatePickerInput
                    placeholder="Select a date"
                    locale="en"
                    label="Time Planted"
                    value={
                    values.time_planted !== undefined ? new Date(values.time_planted) : inputDate
                  }
                    onChange={(d) => { setInputDate(d); values.time_planted = d.toISOString(); }}
                    inputMode="start"
                    width="100%"
                    underlineStyle={{ backgroundColor: 'white' }}
                    contentStyle={{ borderRadius: 10 }}
                  />
                </PaperProvider>
              </View>

              <FormControl.ErrorMessage>
                {errors.time_planted}
              </FormControl.ErrorMessage>
            </FormControl>

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
              <Text style={styles.buttonText}>Update Plant</Text>
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

export default EditPlantForm;
