import {
  Text,
  View,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import PlantUtils from '../../api/utils/PlantUtils';
import { Formik } from 'formik';
import * as yup from 'yup';
import API from '../../api/API';

import {
  Input, Icon, FormControl, Pressable, VStack
} from 'native-base';
import { MaterialIcons ,Select} from '@expo/vector-icons';

import { LogBox } from 'react-native';


LogBox.ignoreLogs(['Encountered two children with the same key']);


const RegisterPlantSchema = yup.object().shape({
  name: yup.string().required('Name is required'),
  device_id: yup.number().required('Device ID is required'),
  plant_profile_id: yup.number().required('Plant profile ID is required'),
  plant_type_id: yup.number().required('Plant type ID is required'),
});

function PlantsScreen({ navigation }) {
  const [language, setLanguage] = useState('');

  const { colors } = useTheme();
  const [userEmail, setUserEmail] = useState('');
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantsTypes] = useState([]);
  const [isViewVisible, setIsViewVisible] = useState(false);


  const handleButtonClick = () => {
    setIsViewVisible(!isViewVisible);
  };

  useEffect(() => {
    PlantUtils.getAuthenticatedUser().then((email) => {
      setUserEmail(email);
    });
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await API.getCurrentUsersPlants();
        // console.log(response.data)
        setPlants(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlants();
  }, []);

  useEffect(() => {
    const fetchPlantsTypes = async () => {
      try {
        const response = await API.getAllPlantTypes();
        // console.log(response.data)
        setPlantsTypes(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlantsTypes();
  }, []);
 

  useEffect(() => {
    console.log(false);
    setIsViewVisible(false);
  }, []);

  if (userEmail == null) {
    return (
      <ActivityIndicator size="large" color="#00ff00" />
    );
  }

  const handleDelete = async (id) => {
    try {
      const response = await API.deletePlant(id);
      // Handle successful deletion here
      console.log(response);
    } catch (error) {
      // Handle error here
    }
  };

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
    <ScrollView style={styles.scrollView}>
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff'
        
      }}
    >

                

      <Text style={colors.textFormat}>{userEmail}</Text>
      <Text style={colors.textFormat}>PlantsScreen
        <Button  style={{top:10}} title={isViewVisible ? 'Close' : 'Create Plant'} onPress={handleButtonClick} />
      </Text>
      
      
      
      {isViewVisible && (
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
      
    )}

    
    <View >
          {plants.map((plant) => (
            <>
              
              <View style={{borderColor:'black',borderWidth:3,padding: 10,width:300,marginBottom:10, borderRadius: 10}}>
                <Text style={{fontSize:25}} key={plant.id}>{plant.name}</Text>
                <TouchableOpacity onPress={() => handleDelete(plant.id)}>
                  <Icon as={MaterialIcons} name="delete" color="coolGray.800" _dark={{color: "warmGray.50"}} />
                </TouchableOpacity>

                <TouchableOpacity onPress={() => handleDelete(plant.id)}>
                  <Icon as={MaterialIcons} name="edit" color="coolGray.800" _dark={{color: "warmGray.50"}} />
                </TouchableOpacity>
                <Text style={{fontSize:20,color:'green'}} key={plant.id}>{plant.plant_type.name}</Text>
                
                <Button
                  title="Plant Details"
                  onPress={() => navigation.navigate('PlantDetails', { itemID: plant.name })} />
              </View>
          </>   
          ))}
      </View>



      <View >
          {plantTypes.map((type) => (
            <>
              
              <View style={{borderColor:'black',borderWidth:3,padding: 10,width:300,marginBottom:10, borderRadius: 10}}>
                <Text style={{fontSize:20,color:'green'}} key={type.id}>{type.name}</Text>
              </View>
          </>   
          ))}
      </View>

      </View>

      </ScrollView>



   
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
    scrollView: {
      marginHorizontal: 40,
      width:'100%',
      // backgroundColor:'grey',
      left:-40
    },
    });
    

export default PlantsScreen;
