import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import {
  Icon,
  Heading,
  VStack,
  HStack,
  Alert, IconButton, CloseIcon, Input, Pressable, Text, Switch, Divider, Button, Modal, AddIcon, Box,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import CreatePlantProfileSchema from '../utils/validationSchema/CreatePlantProfileSchema';
import API from '../api/API';

function CreatePlantProfileForm(props) {
  const { plantTypes } = props;
  const { userData } = props;
  /// //////
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

  // Filter out already selected types from the list of types
  const availableTypes = types.filter((type) => !selectedTypes.includes(type));

  /// /////
  const statusArray = [{
    status: 'success',
    title: 'Plant Profile successfully edited!',
  }, {
    status: 'error',
    title: 'An error has occured!',
  }];
  const [event, setEvent] = useState('');

  const [showPTDropdown, setShowPTDropdown] = useState(false);
  const [searchPTTerm, setSearchPTTerm] = useState('');
  const [selectedPlantType, setSelectedPlantType] = useState('Choose a plant type');
  const [foundPTLength, setfoundPTLength] = useState('');

  const filteredStatusArray = statusArray.filter((status) => status.status === event);

  const handleClose = () => {
    setEvent('');
  };

  const handleRegisterPlantProfile = async (values, { setSubmitting }) => {
    try {
      const response = await API.registerPlantProfile(values);
      values.plant_profile_id = response.data.id;
      const propertiesArray = Object.entries(values.properties);
      try {
        await Promise.all(
          propertiesArray.map(async (property) => {
            const submittedValues = {
              min: property[1].min,
              max: property[1].max,
              sensor_id: values.sensor_id,
              grow_property_type_id:
              allPropertyTypes.filter((typeObject) => typeObject.name === property[0])[0].id,
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

  const filterPlantTypes = (aSearchTerm) => {
    if (aSearchTerm === '') {
      return plantTypes;
    }
    const filtered = plantTypes.filter(
      (plantT) => plantT.name.toLowerCase().includes(aSearchTerm.toLowerCase()),
    );
    setfoundPTLength(filtered.length);
    return filtered;
  };

  return (
    <View>
      <Formik
        initialValues={{
          name: '',
          description: '',
          public: false,
          grow_duration: '',
          plant_type_id: '',
          properties: selectedTypes.reduce((acc, property) => ({
            ...acc,
            [property]: { min: 0, max: 0 },
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

            <Heading style={styles.label}>Name</Heading>
            <Input
              onChangeText={handleChange('name')}
              onBlur={handleBlur('name')}
              value={values.name}
              w="100%"
              size="2xl"
              marginBottom="2%"
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <Heading style={styles.label}>Description</Heading>
            <Input
              onChangeText={handleChange('description')}
              onBlur={handleBlur('description')}
              value={values.description}
              w="100%"
              size="2xl"
              marginBottom="2%"
            />
            {touched.description && errors.description
            && <Text style={styles.error}>{errors.description}</Text>}

            {/* Plant Types search and select Dropdown */}
            <Heading style={styles.label}>Plant Type</Heading>
            <View style={{ width: '100%' }}>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Input
                  placeholder={showPTDropdown ? 'Search for a plant type' : selectedPlantType}
                  value={searchPTTerm}
                  onChangeText={(text) => {
                    setSearchPTTerm(text);
                  }}
                  style={{ flex: 1, padding: 10 }}
                  w="100%"
                  size="2xl"
                  marginBottom="2%"
                  InputLeftElement={showPTDropdown ? <Icon as={<MaterialIcons name="search" />} size={5} ml="2" color="muted.400" /> : null}
                  InputRightElement={(
                    <Pressable onPress={() => { setSearchPTTerm(''); setShowPTDropdown(!showPTDropdown); }}>
                      <Icon as={MaterialIcons} name={showPTDropdown ? 'arrow-drop-up' : 'arrow-drop-down'} color="coolGray.800" _dark={{ color: 'warmGray.50' }} size={8} />
                    </Pressable>
                )}
                  isDisabled={showPTDropdown === false}
                />
              </View>
              {showPTDropdown && (
              <ScrollView style={{ maxHeight: 100 }}>
                {
                  filterPlantTypes(searchPTTerm).map((plantType) => (
                    <View style={{
                      flexDirection: 'row', alignItems: 'left', width: '100%', borderBottomWidth: 1, padding: 5,
                    }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          values.plant_type_id = plantType.id;
                          setSelectedPlantType(plantType.name);
                          setSearchPTTerm(plantType.name);
                          setShowPTDropdown(false);
                        }}
                        style={{ flex: 9 }}
                      >
                        <Text fontSize={16} style={{ width: '100%' }}>{plantType.name}</Text>
                      </TouchableOpacity>
                      {selectedPlantType === plantType.name && <Icon as={MaterialIcons} name="check" color="coolGray.800" _dark={{ color: 'warmGray.50' }} size={6} />}
                    </View>
                  ))
                }
              </ScrollView>
              )}
              {searchPTTerm.length > 0
              && foundPTLength < 1
              && showPTDropdown
              && <Text style={styles.error}>No results found</Text>}

            </View>
            {touched.plant_type_id && errors.plant_type_id && (
            <Text style={styles.error}>{errors.plant_type_id}</Text>
            )}

            <HStack space={2} alignItems="center" justifyContent="center" width="80%" padding={10}>
              <Heading style={{ fontSize: 16, marginRight: 15 }}>Public</Heading>
              {values.public ? <Switch defaultIsChecked onValueChange={(value) => values.public = value} size="md" />
                : <Switch onValueChange={(value) => values.public = value} size="md" />}
            </HStack>

            <HStack space={2} alignItems="center" justifyContent="center" width="80%" padding={10}>
              <Heading style={{ fontSize: 16, marginRight: 15 }}>Grow Duration (days)</Heading>
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
            {touched.grow_duration && errors.grow_duration && (
            <Text style={styles.error}>{errors.grow_duration}</Text>
            )}

            <HStack space={2} padding={5}>
              <Heading alignSelf="left">
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
                  alignItems: 'center',
                }}
                onPress={handleAdd}
              >
                <Icon as={MaterialIcons} name="add" color="white" _dark={{ color: 'white' }} />
              </TouchableOpacity>
            </HStack>
            <Divider />

            <Modal isOpen={showTypeButtons} onClose={() => setShowTypeButtons(false)}>
              <Modal.Content maxWidth="400px">
                <Modal.CloseButton />
                <Modal.Header>Pick property type</Modal.Header>
                <Modal.Body>

                  {availableTypes.map((type) => (
                    <>
                      <Button key={type} onPress={() => handleTypeSelect(type)}>{type}</Button>
                      <Text> </Text>

                    </>
                  ))}
                </Modal.Body>
              </Modal.Content>
            </Modal>
            {selectedTypes.length > 0 && (
            <VStack space={4} w="90%" paddingTop={5}>
              <HStack justifyContent="space-between">
                <Text w={Platform.OS === 'web' ? '40%' : '32%'} />
                <Text w="27%">Minimum</Text>
                <Text w="25%">Maximum</Text>
                <Text w="5%" />
              </HStack>
              {selectedTypes.map((property) => (
                <HStack key={property} justifyContent="space-between">
                  <Text w={Platform.OS === 'web' ? '25%' : '32%'} fontSize={Platform.OS === 'web' ? 'md' : 'xs'}>{property}</Text>
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
                    <Button borderRadius={100} w={10} h={10} onPress={() => handleDelete(property)}>
                      <Icon as={MaterialIcons} name="close" color="white" _dark={{ color: 'white' }} />
                    </Button>
                  </View>
                </HStack>
              ))}
            </VStack>
            )}

            {selectedTypes.map((property) => (
              <View key={property}>
                {touched.properties?.[property]?.min && errors.properties?.[property]?.min && (
                <Text style={styles.error}>{errors.properties[property].min}</Text>
                )}
                {touched.properties?.[property]?.max && errors.properties?.[property]?.max && (
                <Text style={styles.error}>{errors.properties[property].max}</Text>
                )}
              </View>
            ))}

            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
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
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    paddingTop: 10,
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
