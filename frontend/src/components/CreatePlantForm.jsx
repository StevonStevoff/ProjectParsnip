import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import { Formik } from 'formik';
import {Icon,Select} from 'native-base';
import { MaterialIcons} from '@expo/vector-icons';
import RegisterPlantSchema from '../utils/validationSchema/CreatePlantSchema';
import API from '../api/API';
import { Alert } from 'react-native';

function CreatePlantForm(props) {
  const { plantTypes } = props;
  const { devices } = props;
  const { plantProfiles } = props;

  const handleRegisterPlant = async (values, { setSubmitting }) => {
      try {
        const response = await API.registerPlant(values);
        Alert.alert('Success', 'Form submitted successfully', [{ text: 'OK'}])
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'An Error has Occured', [{ text: 'OK'}])
        // handle the error
      } finally {
        setSubmitting(false);
      }

  };
  
  return (
    
    <Formik
    initialValues={{
    name: '',
    device_id: '',
    plant_profile_id: '',
    plant_type_id: ''
    }}
    validationSchema={RegisterPlantSchema}
    onSubmit={handleRegisterPlant}
    >
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
        <View style={styles.container}>
            <Text style={styles.label}>Name</Text>
            <TextInput
            style={styles.input}
            onChangeText={handleChange('name')}
            onBlur={handleBlur('name')}
            value={values.name}
            />
            {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

            <Text style={styles.label}>Device</Text>
            <Select
              minWidth="330"
              accessibilityLabel="Choose Device"
              placeholder="Choose Device"
              _selectedItem={{
                bg: "teal.600",
                endIcon: (
                  <Icon
                    as={MaterialIcons}
                    name="check"
                    color="coolGray.800"
                    _dark={{ color: "warmGray.50" }}
                  />
                )
              }}
              mt="1"
              selectedValue={values.device_id}
              onValueChange={(value) => handleChange('device_id')(value)}
              onBlur={handleBlur('device_id')}
            >
              {devices.map((device) => (
                <Select.Item label={device.name} value={device.id.toString()} key={device.id}/>
                ))}
            </Select>
            {touched.device_id && errors.device_id && (
              <Text style={styles.error}>{errors.device_id}</Text>
            )}

            <Text style={styles.label}>Plant Profile</Text>
            <Select
              minWidth="330"
              accessibilityLabel="Choose Plant Profile"
              placeholder="Choose Plant Profile"
              _selectedItem={{
                bg: "teal.600",
                endIcon: (
                  <Icon
                    as={MaterialIcons}
                    name="check"
                    color="coolGray.800"
                    _dark={{ color: "warmGray.50" }}
                  />
                )
              }}
              mt="1"
              selectedValue={values.plant_profile_id}
              onValueChange={(value) => handleChange('plant_profile_id')(value)}
              onBlur={handleBlur('plant_profile_id')}
            >
              {plantProfiles.map((plantProfile) => (
                <Select.Item label={plantProfile.name} value={plantProfile.id.toString()} key={plantProfile.id}/>
                ))}
            </Select>
            {touched.plant_profile_id && errors.plant_profile_id && (
              <Text style={styles.error}>{errors.plant_profile_id}</Text>
            )}

            <Text style={styles.label}>Plant Type</Text>
            <Select
              minWidth="330"
              accessibilityLabel="Choose Plant Type"
              placeholder="Choose Plant Type"
              _selectedItem={{
                bg: "teal.600",
                endIcon: (
                  <Icon
                    as={MaterialIcons}
                    name="check"
                    color="coolGray.800"
                    _dark={{ color: "warmGray.50" }}
                  />
                )
              }}
              mt="1"
              selectedValue={values.plant_type_id}
              onValueChange={(value) => handleChange('plant_type_id')(value)}
              onBlur={handleBlur('plant_type_id')}
            >
              {plantTypes.map((type) => (
                <Select.Item label={type.name} value={type.id.toString()} key={type.id}/>
                ))}
            </Select>

            {touched.plant_type_id && errors.plant_type_id && (
              <Text style={styles.error}>{errors.plant_type_id}</Text>
            )}


            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
            <Text style={styles.buttonText}>Register Plant</Text>
            </TouchableOpacity>
        </View>
    )}
    </Formik>
   );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 4,
      padding: 8,
      marginBottom: 16,
      minWidth:330,
    },
      error: {
      color: 'red',
      marginBottom: 8,
      },
      button: {
      backgroundColor: '#4caf50',
      padding: 12,
      borderRadius: 4,
      marginTop:10
      },
      buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      }
      });

export default CreatePlantForm;

