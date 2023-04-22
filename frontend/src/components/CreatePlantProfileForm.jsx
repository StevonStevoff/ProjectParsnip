import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import { Formik } from 'formik';
import {
  Icon, Heading, VStack, HStack, Alert, IconButton, CloseIcon, Input, Pressable, Text, Switch,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import CreatePlantProfileSchema from '../utils/validationSchema/CreatePlantProfileSchema';
import API from '../api/API';

function CreatePlantProfileForm(props) {
  const { plantTypes } = props;
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
      console.log(values);
      const response = await API.registerPlantProfile(values);
      console.log(response);
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
          grow_duration: 0,
          plant_type_id: '',
          min: 0,
          max: 0,
          user_ids: [1],
          // grow_property_ids: [1],
        }}
        validationSchema={CreatePlantProfileSchema}
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

            {/* <VStack space={4} w="90%">
              <HStack justifyContent="space-between">
                <Text w="25%" />
                <Text w="20%">Minimum</Text>
                <Text w="20%">Maximum</Text>
              </HStack>
              {plantProfile.grow_properties.map((property) => (
                <HStack justifyContent="space-between">
                  <Text w="25%" fontSize={Platform.OS === 'web' ? 'md' : 'xs'}>{property.grow_property_type.name}</Text>
                  <Input
                    onChangeText={handleChange('min')}
                    onBlur={handleBlur('min')}
                    value={values.min.toString()}
                    style={{ padding: 5 }}
                    w="20%"
                    size="2xl"
                    marginBottom="2%"
                  />
                  <Input
                    onChangeText={handleChange('max')}
                    onBlur={handleBlur('max')}
                    value={values.max.toString()}
                    style={{ padding: 5 }}
                    w="20%"
                    size="2xl"
                    marginBottom="2%"
                  />
                </HStack>
              ))}
            </VStack>
            {touched.min && errors.min && (
            <Text style={styles.error}>{errors.min}</Text>
            )}
            {touched.max && errors.max && (
            <Text style={styles.error}>{errors.max}</Text>
            )} */}

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
