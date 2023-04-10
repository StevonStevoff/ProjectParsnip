import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  FlatList,
  ScrollView,
} from 'react-native';
import { Formik } from 'formik';
import {Icon,Heading,VStack,HStack,Alert,IconButton,CloseIcon,Input,Pressable,Text} from 'native-base';
import { MaterialIcons} from '@expo/vector-icons';
import EditPlantSchema from '../utils/validationSchema/EditPlantSchema';
import API from '../api/API';

function EditPlantForm(props) {
  const { plantTypes } = props;
  const { devices } = props;
  const { plantProfiles } = props;
  const { plant } = props;
  const statusArray = [{
    status: "success",
    title: "Plant successfully edited!"
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

  const [selectedDevice, setSelectedDevice] = useState(plant.device.name);
  const [selectedPlantType, setSelectedPlantType] = useState(plant.plant_type.name);
  const [selectedPlantProfile, setSelectedPlantProfile] = useState(plant.plant_profile.name);

  const [foundDLength, setfoundDLength] = useState("");
  const [foundPTLength, setfoundPTLength] = useState("");
  const [foundPPLength, setfoundPPLength] = useState("");


  const filteredStatusArray = statusArray.filter((status) => status.status === event);

  const handleClose = () => {
    setEvent("");
  };

  const handleEditPlant = async (values, { setSubmitting }) => {
      try {
        await API.editPlant(values);
        console.log(values)
        setEvent("success")
      } catch (error) {
        setEvent("error")
        console.log(error)
        // handle the error
      } finally {
        setSubmitting(false);
      }

  };

  const filterDevices = (searchTerm) => {
    if (searchTerm === "") {
      return devices;
    }else{
      const filtered = devices.filter((device) =>
        device.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setfoundDLength(filtered.length);
      return filtered;
    }
  };

  const filterPlantTypes = (searchTerm) => {
    if (searchTerm === "") {
      return plantTypes;
    }else{
      const filtered = plantTypes.filter((plantT) =>
      plantT.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setfoundPTLength(filtered.length);
      return filtered;
    }
  };

  const filterPlantProfiles= (searchTerm) => {
    if (searchTerm === "") {
      return plantProfiles;
    }else{
      const filtered = plantProfiles.filter((plantp) =>
      plantp.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setfoundPPLength(filtered.length);
      return filtered;
    }
  };
  
  return (
    
    <Formik
    initialValues={{
      id: plant.id,
      name: plant.name,
      device_id: plant.device.id.toString(),
      plant_profile_id: plant.plant_profile.id.toString(),
      plant_type_id: plant.plant_type.id.toString(),
    }}
    validationSchema={EditPlantSchema}
    onSubmit={handleEditPlant}
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

        <Heading style={styles.label}>Device</Heading>
        <View style={{width:"100%"}}>    
      {/* Devices search and select Dropdown */}
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <Input  placeholder={showDropdown ? "Search for a device" : selectedDevice}  value={searchTerm}  
            onChangeText={(text) => { 
            setSearchTerm(text);  
            }}
            style={{ flex: 1 ,padding:10}}
            w="100%"
            size="2xl"
            marginBottom="2%"
            InputLeftElement={showDropdown ?<Icon as={<MaterialIcons name="search" />} size={5} ml="2" color="muted.400" />:null}
            InputRightElement={(
              <Pressable onPress={() => { setSearchTerm(''); setShowDropdown(!showDropdown);}}>
                <Icon as={MaterialIcons} name={showDropdown ? 'arrow-drop-up' : 'arrow-drop-down'} color="coolGray.800" _dark={{ color: "warmGray.50" }} size={showDropdown ? 8 : 8}/>
              </Pressable>
            )}
            isDisabled={showDropdown===false}
            /> 
        </View>
        {showDropdown && (
          <ScrollView style={{ maxHeight: 100 }}>
            {
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
              ))
            }
          </ScrollView>
        )}
        {searchTerm.length > 0 && foundDLength<1 && showDropdown && <Text style={styles.error}>No results found</Text>}


      </View>
      {touched.device_id && errors.device_id && (
        <Text style={styles.error}>{errors.device_id}</Text>
      )}

          {/* Plant Profiles search and select Dropdown */}
        <Heading style={styles.label}>Plant Profile</Heading>
        <View style={{width:"100%"}}> 

        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <Input  placeholder={showPPDropdown ? "Search for a plant profile" : selectedPlantProfile}  value={searchPPTerm}  
            onChangeText={(text) => { 
            setSearchPPTerm(text);  
            }}
            style={{ flex: 1 ,padding:10}}
            w="100%"
            size="2xl"
            marginBottom="2%"
            InputLeftElement={showPPDropdown ?<Icon as={<MaterialIcons name="search" />} size={5} ml="2" color="muted.400" />:null}
            InputRightElement={(
              <Pressable onPress={() => { setSearchPPTerm(''); setShowPPDropdown(!showPPDropdown);}}>
                <Icon as={MaterialIcons} name={showPPDropdown ? 'arrow-drop-up' : 'arrow-drop-down'} color="coolGray.800" _dark={{ color: "warmGray.50" }} size={8}/>
              </Pressable>
            )}
            isDisabled={showPPDropdown===false}
            /> 
        </View>
        {showPPDropdown && (
          <ScrollView style={{ maxHeight: 100 ,color:"green"}}>
            {
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
              ))
            }
          </ScrollView>
        )}
        {searchPPTerm.length > 0 && foundPPLength<1 && showPPDropdown && <Text style={styles.error}>No results found</Text>}

        </View>
        {touched.plant_profile_id && errors.plant_profile_id && (
          <Text style={styles.error}>{errors.plant_profile_id}</Text>
        )}
        

        {/* Plant Types search and select Dropdown */}
        <Heading style={styles.label}>Plant Type</Heading>
        <View style={{width:"100%"}}>
        <View style={{ flexDirection: 'row', alignItems: 'center'}}>
            <Input  placeholder={showPTDropdown ? "Search for a plant type" : selectedPlantType}  value={searchPTTerm}  
            onChangeText={(text) => { 
            setSearchPTTerm(text);  
            }}
            style={{ flex: 1 ,padding:10}}
            w="100%"
            size="2xl"
            marginBottom="2%"
            InputLeftElement={showPTDropdown ?<Icon as={<MaterialIcons name="search" />} size={5} ml="2" color="muted.400" />:null}
            InputRightElement={(
              <Pressable onPress={() => { setSearchPTTerm(''); setShowPTDropdown(!showPTDropdown);}}>
                <Icon as={MaterialIcons} name={showPTDropdown ? 'arrow-drop-up' : 'arrow-drop-down'} color="coolGray.800" _dark={{ color: "warmGray.50" }} size={8}/>
              </Pressable>
            )}
            isDisabled={showPTDropdown===false}
            /> 
        </View>
        {showPTDropdown && (
          <ScrollView style={{ maxHeight: 100 }}>
            {
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
              ))
            }
          </ScrollView>
        )}
        {searchPTTerm.length > 0 && foundPTLength<1 && showPTDropdown && <Text style={styles.error}>No results found</Text>}
        </View>
        {touched.plant_type_id && errors.plant_type_id && (
          <Text style={styles.error}>{errors.plant_type_id}</Text>
        )}
        


        <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isSubmitting}>
        <Text style={styles.buttonText}>Update Plant</Text>
        </TouchableOpacity>
    </View>
    )}
    </Formik>
   );
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      height:"100%",
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      paddingTop:10
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
      borderRadius: 10,
      marginTop:20,
      alignContent:"center",
      justifyContent: 'center',
      width:"100%",
      flexDirection: 'row',
      },
      buttonText: {
      fontSize: 16,
      fontWeight: 'bold',
      alignContent:"center",
      justifyContent: 'center',
      }
      });

export default EditPlantForm;

