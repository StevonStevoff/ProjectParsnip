import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import {Icon,Select,VStack,HStack,Alert,IconButton,CloseIcon,Modal,Input,Button,FormControl,Actionsheet} from 'native-base';
import { MaterialIcons} from '@expo/vector-icons';
import RegisterPlantSchema from '../utils/validationSchema/CreatePlantSchema';
import API from '../api/API';
import MultiSelect from 'react-native-multiple-select';

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

  const [showDropdown, setShowDropdown] = useState(false);
  const [showPTDropdown, setShowPTDropdown] = useState(false);
  const [showPPDropdown, setShowPPDropdown] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [searchPTTerm, setSearchPTTerm] = useState("");
  const [searchPPTerm, setSearchPPTerm] = useState("");

  const [selectedDevice, setSelectedDevice] = useState("");
  const [selectedPlantType, setSelectedPlantType] = useState("");
  const [selectedPlantProfile, setSelectedPlantProfile] = useState("");

  const [foundDLength, setfoundDLength] = useState("");
  const [foundPTLength, setfoundPTLength] = useState("");
  const [foundPPLength, setfoundPPLength] = useState("");

  const filteredStatusArray = statusArray.filter((status) => status.status === event);

  const handleClose = () => {
    setEvent("");
  };

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
  
  const filterDevices = (searchTerm) => {
    const filtered = devices.filter((device) =>
      device.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setfoundDLength(filtered.length);
    return filtered;
  };

  const filterPlantTypes = (searchTerm) => {
    const filtered = plantTypes.filter((plantT) =>
    plantT.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setfoundPTLength(filtered.length);
    return filtered;
  };

  const filterPlantProfiles= (searchTerm) => {
    const filtered = plantProfiles.filter((plantp) =>
    plantp.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setfoundPPLength(filtered.length);
    return filtered;
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
        <View style={{width:"100%"}}>    
      {/* Devices search and select Dropdown */}
      <View> 
        <View style={{ flexDirection: 'row', alignItems: 'center',borderColor:"black" ,borderRadius:10,borderWidth:1,padding:5}}>
          {showDropdown ? 
            <><Icon as={MaterialIcons} name='search' color="coolGray.800" _dark={{ color: "warmGray.50" }} size={6}/>
            <TextInput  placeholder="Search for a device"  value={searchTerm}  
            onChangeText={(text) => { 
            setSearchTerm(text);  
            }}
            style={{ flex: 1 }}
            /></> : 
            selectedDevice?<Text style={{width:"100%", flex: 1}} >{selectedDevice}</Text>:<Text style={{width:"100%", flex: 1}} >Choose Device</Text>
          }

          <TouchableOpacity onPress={() => {
          setSearchTerm('');
          setShowDropdown(!showDropdown);
          }}
          >
            <Icon as={MaterialIcons} name={showDropdown ? 'arrow-drop-up' : 'arrow-drop-down'} color="coolGray.800" _dark={{ color: "warmGray.50" }} size={showDropdown ? 8 : 8}/>
          </TouchableOpacity>
        </View>
        {showDropdown && (
          <ScrollView style={{ maxHeight: 100 }}>
            {searchTerm ? 
              filterDevices(searchTerm).map((device) => (
                <View style={{ flexDirection: 'row', alignItems: 'left' ,width:"100%",borderBottomWidth:1,padding:5}}>
                  <TouchableOpacity onPress={() => { values.device_id=device.id 
                  setSelectedDevice(device.name); setSearchTerm(device.name); setShowDropdown(false);
                  }} style={{ flex: 9 }}
                  >
                    <Text  style={{width:"100%"}}>{device.name}</Text>
                  </TouchableOpacity>
                  {selectedDevice=== device.name && <Icon as={MaterialIcons} name='check' color="coolGray.800" _dark={{ color: "warmGray.50" }} size={6} />}
                </View>
              )): 
              devices.map((device) => (
                <View style={{ flexDirection: 'row', alignItems: 'left' ,width:"100%",borderBottomWidth:1,padding:5}}>
                  <TouchableOpacity onPress={() => { values.device_id=device.id
                  setSelectedDevice(device.name); setSearchTerm(device.name); setShowDropdown(false);
                  }} style={{ flex: 9 }}
                  >
                    <Text  style={{width:"100%"}}>{device.name}</Text>   
                  </TouchableOpacity>
                  {selectedDevice=== device.name && <Icon as={MaterialIcons} name='check' color="coolGray.800" _dark={{ color: "warmGray.50" }} size={6} />}
                </View>
              ))
            }
          </ScrollView>
        )}
        {searchTerm.length > 0 && foundDLength<1 && showDropdown && <Text style={styles.error}>No results found</Text>}
      </View>

      </View>
      {touched.device_id && errors.device_id && (
        <Text style={styles.error}>{errors.device_id}</Text>
      )}

          {/* Plant Profiles search and select Dropdown */}
        <Text style={styles.label}>Plant Profile</Text>
        <View style={{width:"100%"}}> 
          <View> 
        <View style={{ flexDirection: 'row', alignItems: 'center',borderColor:"black" ,borderRadius:10,borderWidth:1,padding:5}}>
          {showPPDropdown ? 
            <><Icon as={MaterialIcons} name='search' color="coolGray.800" _dark={{ color: "warmGray.50" }} size={6}/>
            <TextInput  placeholder="Search for a plant profile"  value={searchPPTerm}  
            onChangeText={(text) => { 
              setSearchPPTerm(text);  
            }}
            style={{ flex: 1 }}
            /></> : 
            selectedPlantProfile?<Text style={{width:"100%", flex: 1}} >{selectedPlantProfile}</Text>:<Text style={{width:"100%", flex: 1}} >Choose Plant Profile</Text>
          }

          <TouchableOpacity onPress={() => {
          setSearchPPTerm('');
          setShowPPDropdown(!showPPDropdown);
          }}
          >
            <Icon as={MaterialIcons} name={showPPDropdown ? 'arrow-drop-up' : 'arrow-drop-down'} color="coolGray.800" _dark={{ color: "warmGray.50" }} size={showPPDropdown ? 8 : 8}/>
          </TouchableOpacity>
        </View>
        {showPPDropdown && (
          <ScrollView style={{ maxHeight: 100 }}>
            {searchPPTerm ? 
              filterPlantProfiles(searchPPTerm).map((plantProfile) => (
                <View style={{ flexDirection: 'row', alignItems: 'left' ,width:"100%",borderBottomWidth:1,padding:5}}>
                  <TouchableOpacity onPress={() => { values.plant_profile_id=plantProfile.id 
                  setSelectedPlantProfile(plantProfile.name); setSearchPPTerm(plantProfile.name); setShowPPDropdown(false);
                  }} style={{ flex: 9 }}
                  >
                    <Text  style={{width:"100%"}}>{plantProfile.name}</Text>
                  </TouchableOpacity>
                  {selectedPlantProfile=== plantProfile.name && <Icon as={MaterialIcons} name='check' color="coolGray.800" _dark={{ color: "warmGray.50" }} size={6} />}
                </View>
              )): 
              plantProfiles.map((plantProfile) => (
                <View style={{ flexDirection: 'row', alignItems: 'left' ,width:"100%",borderBottomWidth:1,padding:5}}>
                  <TouchableOpacity onPress={() => { values.plant_profile_id=plantProfile.id
                  setSelectedPlantProfile(plantProfile.name); setSearchPPTerm(plantProfile.name); setShowPPDropdown(false);
                  }} style={{ flex: 9 }}
                  >
                    <Text  style={{width:"100%"}}>{plantProfile.name}</Text>   
                  </TouchableOpacity>
                  {selectedPlantProfile=== plantProfile.name && <Icon as={MaterialIcons} name='check' color="coolGray.800" _dark={{ color: "warmGray.50" }} size={6} />}
                </View>
              ))
            }
          </ScrollView>
        )}
        {searchPPTerm.length > 0 && foundPPLength<1 && showPPDropdown && <Text style={styles.error}>No results found</Text>}
      </View>
        </View>
        {touched.plant_profile_id && errors.plant_profile_id && (
          <Text style={styles.error}>{errors.plant_profile_id}</Text>
        )}
        

        {/* Plant Types search and select Dropdown */}
        <Text style={styles.label}>Plant Type</Text>
        <View style={{width:"100%"}}>
        <View> 
        <View style={{ flexDirection: 'row', alignItems: 'center',borderColor:"black" ,borderRadius:10,borderWidth:1,padding:5}}>
          {showPTDropdown ? 
            <><Icon as={MaterialIcons} name='search' color="coolGray.800" _dark={{ color: "warmGray.50" }} size={6}/>
            <TextInput  placeholder="Search for a plant type"  value={searchPTTerm}  
            onChangeText={(text) => { 
              setSearchPTTerm(text);  
            }}
            style={{ flex: 1 }}
            /></> : 
            selectedPlantType?<Text style={{width:"100%", flex: 1}} >{selectedPlantType}</Text>:<Text style={{width:"100%", flex: 1}} >Choose Plant Type</Text>
          }

          <TouchableOpacity onPress={() => {
          setSearchPTTerm('');
          setShowPTDropdown(!showPTDropdown);
          }}
          >
            <Icon as={MaterialIcons} name={showPTDropdown ? 'arrow-drop-up' : 'arrow-drop-down'} color="coolGray.800" _dark={{ color: "warmGray.50" }} size={showPTDropdown ? 8 : 8}/>
          </TouchableOpacity>
        </View>
        {showPTDropdown && (
          <ScrollView style={{ maxHeight: 100 }}>
            {searchPTTerm ? 
              filterPlantTypes(searchPTTerm).map((plantType) => (
                <View style={{ flexDirection: 'row', alignItems: 'left' ,width:"100%",borderBottomWidth:1,padding:5}}>
                  <TouchableOpacity onPress={() => { values.plant_type_id=plantType.id 
                  setSelectedPlantType(plantType.name); setSearchPTTerm(plantType.name); setShowPTDropdown(false);
                  }} style={{ flex: 9 }}
                  >
                    <Text  style={{width:"100%"}}>{plantType.name}</Text>
                  </TouchableOpacity>
                  {selectedPlantType=== plantType.name && <Icon as={MaterialIcons} name='check' color="coolGray.800" _dark={{ color: "warmGray.50" }} size={6} />}
                </View>
              )): 
              plantTypes.map((plantType) => (
                <View style={{ flexDirection: 'row', alignItems: 'left' ,width:"100%",borderBottomWidth:1,padding:5}}>
                  <TouchableOpacity onPress={() => { values.plant_type_id=plantType.id
                  setSelectedPlantType(plantType.name); setSearchPTTerm(plantType.name); setShowPTDropdown(false);
                  }} style={{ flex: 9 }}
                  >
                    <Text  style={{width:"100%"}}>{plantType.name}</Text>   
                  </TouchableOpacity>
                  {selectedPlantType=== plantType.name && <Icon as={MaterialIcons} name='check' color="coolGray.800" _dark={{ color: "warmGray.50" }} size={6} />}
                </View>
              ))
            }
          </ScrollView>
        )}
        {searchPTTerm.length > 0 && foundPTLength<1 && showPTDropdown && <Text style={styles.error}>No results found</Text>}
      </View>
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

