import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import {
  Icon,
  Heading,
  VStack,
  HStack,
  Alert,
  IconButton,
  CloseIcon,
  Input,
  Text,
  Switch,
  Divider,
  Button,
  Modal,
  FormControl,
  Center,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import CreatePlantProfileSchema from '../utils/validationSchema/CreatePlantProfileSchema';
import API from '../api/API';
import CustomSearchDropdown from './CustomSearchDropdown';

function CreatePlantProfileForm(props) {
  const { plantTypes } = props;
  const { userData } = props;

  const statusArray = [{
    status: 'success',
    title: 'Plant Profile successfully created!',
  }, {
    status: 'error',
    title: 'An error has occured!',
  }];
  const [event, setEvent] = useState('');

  const [types, setTypes] = useState([]);
  const [allPropertyTypes, setAllPropertyTypes] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [showTypeButtons, setShowTypeButtons] = useState(false);

  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        const response = await API.getGrowPropertyTypes();
        setAllPropertyTypes(response.data);
        setTypes(response.data.map((typea) => typea.name));
      } catch (error) { /* empty */ }
    };
    fetchPropertyTypes();
  }, []);

  const handleAdd = () => {
    setShowTypeButtons(!showTypeButtons);
  };

  const handleTypeSelect = (type) => {
    if (!selectedTypes.includes(type)) {
      setSelectedTypes([...selectedTypes, type]);
    }
    setShowTypeButtons(false);
  };

  const handleDelete = (type) => {
    setSelectedTypes(selectedTypes.filter((t) => t !== type));
  };

  const handleClose = () => {
    setEvent('');
  };

  const handleRegisterPlantProfile = async (values, { setSubmitting }) => {
    // Delete removed types from the properties object
    Object.keys(values.properties).forEach((key) => {
      if (!selectedTypes.includes(key)) {
        delete values.properties[key];
      }
    });

    try {
      const response = await API.registerPlantProfile(values);
      values.plant_profile_id = response.data.id;
      const propertiesArray = Object.entries(values.properties);
      try {
        await Promise.all(
          propertiesArray.map(async (property) => {
            const growId = allPropertyTypes.filter(
              (typeObject) => typeObject.name === property[0],
            )[0].id;
            const submittedValues = {
              min: property[1].min,
              max: property[1].max,
              grow_property_type_id: growId,
              sensor_id: growId,
              plant_profile_id: values.plant_profile_id,
            };
            await API.registerGrowProperty(submittedValues);
          }),
        );
      } catch (error) { /* empty */ }

      setEvent('success');
    } catch (error) {
      setEvent('error');
      // handle the error
    } finally {
      setSubmitting(false);
    }
  };

  // Filter out already selected types from the list of types
  const availableTypes = types.filter((type) => !selectedTypes.includes(type));

  const filteredStatusArray = statusArray.filter((status) => status.status === event);
  return (
    <View style={{ flex: 1 }}>
      <Formik
        initialValues={{
          name: '',
          description: '',
          public: false,
          grow_duration: '',
          plant_type_id: '',
          properties: selectedTypes.reduce((acc, property) => ({
            ...acc,
            [property]: { min: '', max: '' },
          }), {}),
          sensor_id: 1,
          grow_property_type_id: 1,
          plant_profile_id: 0,
          user_ids: [userData.id],
        }}
        validationSchema={CreatePlantProfileSchema(selectedTypes)}
        onSubmit={handleRegisterPlantProfile}
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

            <FormControl isRequired isInvalid={errors.description && touched.description}>
              <FormControl.Label>Description</FormControl.Label>
              <Input
                onChangeText={handleChange('description')}
                onBlur={handleBlur('description')}
                value={values.description}
                w="100%"
                size="2xl"
                marginBottom="2%"
              />
              <FormControl.ErrorMessage>
                {errors.description}
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
              <HStack space={2} justifyContent="center" width="80%" padding={5}>
                <Heading style={{ fontSize: 16, marginRight: 15 }}>Public</Heading>
                {values.public ? <Switch defaultIsChecked onValueChange={(value) => values.public = value} size="md" />
                  : <Switch onValueChange={(value) => values.public = value} size="md" />}
              </HStack>
            </Center>

            <FormControl isRequired isInvalid={errors.grow_duration && touched.grow_duration}>
              <Center>
                <HStack space={2} justifyContent="center" width="80%" padding={5}>
                  <FormControl.Label>Grow Duration (days)</FormControl.Label>
                  <Input
                    onChangeText={handleChange('grow_duration')}
                    onBlur={handleBlur('grow_duration')}
                    value={values.grow_duration.toString()}
                    style={{ padding: 5 }}
                    w="40%"
                    size="2xl"
                    marginBottom="2%"
                  />
                </HStack>
                <FormControl.ErrorMessage>
                  {errors.grow_duration}
                </FormControl.ErrorMessage>
              </Center>
            </FormControl>

            <Center>
              <HStack space={2} padding={5}>
                <Heading>
                  Grow Properties
                  {' '}
                </Heading>
                <TouchableOpacity
                  style={{
                    padding: 10,
                    backgroundColor: '#1E3438',
                    borderRadius: 100,
                    borderWidth: 1,
                    borderColor: '#1E6738',
                    height: 40,
                    width: 40,
                    justifyContent: 'center',
                  }}
                  onPress={handleAdd}
                >
                  <Icon as={MaterialIcons} name="add" color="white" _dark={{ color: 'white' }} />
                </TouchableOpacity>
              </HStack>
            </Center>

            <Divider />

            <Modal isOpen={showTypeButtons} onClose={() => setShowTypeButtons(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Pick property type</Modal.Header>
                <Modal.Body>

                  {availableTypes.map((type) => (
                    <View key={type}>
                      <Button onPress={() => handleTypeSelect(type)}>{type}</Button>
                      <Text> </Text>
                    </View>
                  ))}
                </Modal.Body>
              </Modal.Content>
            </Modal>

            {selectedTypes.length > 0 ? (
              <VStack space={4} w="90%" paddingTop={5}>
                <HStack justifyContent="space-between">
                  <Text w={Platform.OS === 'web' ? '40%' : '32%'} />
                  <Text w="27%">Minimum</Text>
                  <Text w="25%">Maximum</Text>
                  <Text w="5%" />
                </HStack>
                {selectedTypes.map((property) => (
                  <FormControl
                    key={property}
                    isRequired
                    isInvalid={
                      touched.properties?.[property]?.min && errors.properties?.[property]?.min
                    }
                  >
                    <HStack justifyContent="space-between">
                      <FormControl.Label
                        w={Platform.OS === 'web' ? '25%' : '32%'}
                        fontSize={Platform.OS === 'web' ? 'md' : 'xs'}
                      >
                        {property}

                      </FormControl.Label>
                      <Input
                        onChangeText={handleChange(`properties.${property}.min`)}
                        onBlur={handleBlur(`properties.${property}.min`)}
                        value={values.properties?.[property]?.min?.toString()}
                        style={{ padding: 5 }}
                        w="27%"
                        size="2xl"
                        marginBottom="2%"
                      />
                      <Input
                        onChangeText={handleChange(`properties.${property}.max`)}
                        onBlur={handleBlur(`properties.${property}.max`)}
                        value={values.properties?.[property]?.max?.toString()}
                        style={{ padding: 5 }}
                        w="25%"
                        size="2xl"
                        marginBottom="2%"
                      />
                      <View w="10%">
                        <Button
                          borderRadius={100}
                          w={10}
                          h={10}
                          onPress={() => handleDelete(property)}
                        >
                          <Icon as={MaterialIcons} name="close" color="white" _dark={{ color: 'white' }} />
                        </Button>
                      </View>
                    </HStack>
                    <Center>
                      <FormControl.ErrorMessage>
                        {errors.properties?.[property]?.min}
                      </FormControl.ErrorMessage>
                      <FormControl.ErrorMessage>
                        {errors.properties?.[property]?.max}
                      </FormControl.ErrorMessage>
                    </Center>
                  </FormControl>
                ))}

              </VStack>
            ) : <Center><Heading style={styles.error}>No property selected</Heading></Center>}

            <TouchableOpacity
              style={styles.button}
              onPress={selectedTypes.length > 0 ? handleSubmit : null}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>Create Plant Profile</Text>
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

export default CreatePlantProfileForm;
