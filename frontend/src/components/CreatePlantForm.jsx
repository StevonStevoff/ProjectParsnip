import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import { Formik } from 'formik';
import RegisterPlantSchema from '../utils/validationSchema/CreatePlantSchema';
import API from '../api/API';

function CreatePlantForm() {
    const handleRegisterPlant = async (values, { setSubmitting }) => {
        try {
          const response = await API.registerPlant(values);
        } catch (error) {
          console.error(error);
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
    plant_type_id: '',
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

            <Text style={styles.label}>Device ID</Text>
            <TextInput
            style={styles.input}
            onChangeText={handleChange('device_id')}
            onBlur={handleBlur('device_id')}
            value={values.device_id}
            />
            {touched.device_id && errors.device_id && <Text style={styles.error}>{errors.device_id}</Text>}

            <Text style={styles.label}>Plant Profile ID</Text>
            <TextInput
            style={styles.input}
            onChangeText={handleChange('plant_profile_id')}
            onBlur={handleBlur('plant_profile_id')}
            value={values.plant_profile_id}
            />
            {touched.plant_profile_id && errors.plant_profile_id && (
            <Text style={styles.error}>{errors.plant_profile_id}</Text>
            )}

            <Text style={styles.label}>Plant Type ID</Text>
            <TextInput
            style={styles.input}
            onChangeText={handleChange('plant_type_id')}
            onBlur={handleBlur('plant_type_id')}
            value={values.plant_type_id}
            />
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
      width:300,
    },
      error: {
      color: 'red',
      marginBottom: 8,
      },
      button: {
      backgroundColor: '#4caf50',
      padding: 12,
      borderRadius: 4,
      },
      buttonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: 'bold',
      }
      });

export default CreatePlantForm;

