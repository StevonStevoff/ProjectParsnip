import {
  Text,
  View,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import PlantUtils from '../../api/utils/PlantUtils';
import { Formik } from 'formik';
import * as yup from 'yup';
import API from '../../api/API';

const RegisterPlantSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  device_id: yup.number().required('Device ID is required'),
  plant_profile_id: yup.number().required('Plant profile ID is required'),
  plant_type_id: yup.number().required('Plant type ID is required'),
});

function PlantsScreen({ navigation }) {
  const { colors } = useTheme();
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    PlantUtils.getAuthenticatedUser().then((email) => {
      setUserEmail(email);
    });
  }, []);

  if (userEmail == null) {
    return (
      <ActivityIndicator size="large" color="#00ff00" />
    );
  }

  const handleRegisterPlant = async (values, { setSubmitting }) => {
    try {
      const response = await API.registerPlant(values);
      console.log(response);
      // do something with the response
    } catch (error) {
      console.error(error);
      // handle the error
    } finally {
      setSubmitting(false);
    }
  };
  return (

    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
      }}
    >
      <Text style={colors.textFormat}>{userEmail}</Text>
      <Text style={colors.textFormat}>PlantsScreen</Text>
      <Button
        title="Plant Details"
        onPress={() => navigation.navigate('PlantDetails', { itemID: 12 })}
      />



      {/* Each Plant Div */}
        <View style={{borderColor:'black'}}>
          <Text  style={colors.textFormat}>Plant Type</Text>
          <View>
            <Text  style={colors.textFormat}>Temp</Text>
            <Text  style={colors.textFormat}>Soil Moisture</Text>
            <Text  style={colors.textFormat}>Soil Nitrogen</Text>
          </View>
        </View>

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
      </View>



   
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
    width:250,
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
    },
    });
    

export default PlantsScreen;
