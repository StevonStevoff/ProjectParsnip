import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput
} from 'react-native';
import { Formik } from 'formik';
import {Icon,Select,VStack,HStack,Alert,IconButton,CloseIcon,Modal,Input,Button,FormControl} from 'native-base';
import { MaterialIcons} from '@expo/vector-icons';
import RegisterPlantSchema from '../utils/validationSchema/CreatePlantSchema';
import API from '../api/API';

function CreatePlantForm(props) {
  const { plantTypes } = props;
  const { devices } = props;
  const { plantProfiles } = props;
  const statusArray = [{
    status: "success",
    title: "Plant successfully created!"
  }, {
    status: "error",
    title: "An error has occured!"
  }];
  const [event, setEvent] = useState("");

  const [filteredOptions, setFilteredOptions] = useState(devices);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredStatusArray = statusArray.filter((status) => status.status === event);

  const handleClose = () => {
    setEvent("");
  };

  const filterOptions = (text) => {
    const filtered = devices.filter((option) =>
      option.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredOptions(filtered);
  };

  const handleSelect = (value) => {
    setSelectedDevice(value);
  };

  const [showModal, setShowModal] = useState(false);

  const handleRegisterPlant = async (values, { setSubmitting }) => {
      try {
        await API.registerPlant(values);
        setEvent("success")
      } catch (error) {
        setEvent("error")
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
      }}
      validationSchema={RegisterPlantSchema}
      onSubmit={handleRegisterPlant}
    >
    {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isSubmitting }) => (
      <View style={styles.container}>
        {filteredStatusArray.length !== 0 && (
          <View style={{padding:5,width:"100%"}}>
            <Alert w="100%" status={filteredStatusArray[0].status} >
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
            

      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        onChangeText={handleChange('name')}
        onBlur={handleBlur('name')}
        value={values.name}
        />
        {touched.name && errors.name && <Text style={styles.error}>{errors.name}</Text>}

      <Text style={styles.label}>Device</Text>
      <TextInput
        value={searchTerm}
        onChangeText={(text) => {
        setSearchTerm(text);
        filterOptions(text);
        }}
        placeholder="Search devices"
      />
      
      <View style={{width:"100%"}}>

        
        <Select
          minWidth="100%"
          accessibilityLabel="Choose Device"
          placeholder="Choose Device"
          _selectedItem={{
            bg: "teal.600",
            endIcon: (<Icon as={MaterialIcons} name="check"  color="coolGray.800" _dark={{ color: "warmGray.50" }}/>)
          }}
          mt="1"
          selectedValue={values.device_id}
          onValueChange={(value) => handleChange('device_id')(value)}
          onBlur={handleBlur('device_id')}

          isOpen="true"
        >
          <Input placeholder="Search" variant="filled" width="100%" borderRadius="10" py="1" px="2" borderWidth="0"/>

          {filteredOptions.map((device) => (
            <Select.Item label={device.name} value={device.id.toString()} key={device.id}/>
          ))}

        </Select>
      </View>
      {touched.device_id && errors.device_id && (
        <Text style={styles.error}>{errors.device_id}</Text>
      )}

    {/* PLANT PROFILES */}
    <Text style={styles.label}>Plant Profile</Text>
    <View style={{width:"100%"}}> 
      <Select
        minWidth="100%"
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
    </View>
    {touched.plant_profile_id && errors.plant_profile_id && (
      <Text style={styles.error}>{errors.plant_profile_id}</Text>
    )}
        
    <Text style={styles.label}>Plant Type</Text>
    <View style={{width:"100%"}}>
      <Select
        minWidth="100%"
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
    </View>
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
      minWidth:"100%",
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

