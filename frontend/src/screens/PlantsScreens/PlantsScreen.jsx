import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {
  Icon,
  Heading,
  VStack,
  HStack,
  Alert,
  IconButton,
  CloseIcon,
  Text,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import PlantUtils from '../../api/utils/PlantUtils';
import API from '../../api/API';

function PlantsScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState('');
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantsTypes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [plantProfiles, setPlantProfiles] = useState([]);

  const statusArray = [{
    status: 'success',
    title: 'Plant successfully edited!',
  }, {
    status: 'error',
    title: 'An error has occured!',
  }];
  const [event, setEvent] = useState('');

  const filteredStatusArray = statusArray.filter((status) => status.status === event);

  const handleClose = () => {
    setEvent('');
  };

  useEffect(() => {
    PlantUtils.getAuthenticatedUser().then((email) => {
      setUserEmail(email);
    });
  }, []);

  // useEffect(() => {
  //   const fetchPlants = async () => {
  //     try {
  //       const response = await API.getCurrentUsersPlants();
  //       setPlants(response.data);
  //     } catch (error) { /* empty */ }
  //   };
  //   fetchPlants();
  // },[]);
  console.log(plants);
  useFocusEffect(
    React.useCallback(() => {
      const fetchPlants = async () => {
        try {
          const response = await API.getCurrentUsersPlants();
          setPlants(response.data);
        } catch (error) { /* empty */ }
      };
      fetchPlants();

      return () => {
        console.log('Screen is unfocused');
      };
    }, []),
  );

  useEffect(() => {
    const fetchPlantsTypes = async () => {
      try {
        const response = await API.getAllPlantTypes();
        setPlantsTypes(response.data);
      } catch (error) { /* empty */ }
    };
    fetchPlantsTypes();
  }, []);

  useEffect(() => {
    const fetchPlantsProfiles = async () => {
      try {
        const response = await API.getAllPlantProfiles();
        setPlantProfiles(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlantsProfiles();
  }, []);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await API.getAllDevices();
        setDevices(response.data);
      } catch (error) { /* empty */ }
    };
    fetchDevices();
  }, []);

  if (userEmail == null) {
    return (
      <ActivityIndicator size="large" color="#00ff00" />
    );
  }

  const handleDelete = async (id) => {
    try {
      await API.deletePlant(id).then(() => {
        setPlants(plants.filter((plant) => plant.id !== id));
        setEvent('success');
      });
    } catch (error) { setEvent('error'); }
  };

  return (
    <ScrollView style={styles.scrollView}>

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
        }}
      >

        {filteredStatusArray.length !== 0 && (
          <View style={{ padding: 5, width: '90%' }}>
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

        <View style={{ flexDirection: 'row' }}>
          <Heading>Your Plants</Heading>
          <TouchableOpacity
            style={styles.createPlantButton}
            onPress={() => navigation.navigate('RegisterPlantScreen', { plantTypes, plantProfiles, devices })}
          >
            <Text style={styles.createText}> Create Plant </Text>
          </TouchableOpacity>
        </View>

        <View style={{ width: '90%' }}>
          {plants.map((plant) => (
            <>
              <Text style={{ fontSize: 25, padding: 7 }} key={plant.id}>{plant.name}</Text>
              <View style={styles.plantContainer}>

                <View style={{ flexDirection: 'row', padding: 10, height: 100 }}>
                  <Text
                    style={{
                      fontSize: 20, color: 'green', flex: 3, fontWeight: 'bold',
                    }}
                    key={plant.id}
                  >
                    {plant.plant_type.name}
                  </Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigation.navigate('EditPlantScreen', {
                      plantTypes, plantProfiles, devices, plant,
                    })}
                  >
                    <Text style={styles.createText}>Edit  </Text>
                    <Icon as={MaterialIcons} name="edit" color="white" _dark={{ color: 'white' }} />
                  </TouchableOpacity>
                  {/* To be Changed to handleEdit */}
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => handleDelete(plant.id)}
                  >
                    <Text style={styles.createText}>Delete </Text>
                    <Icon as={MaterialIcons} name="delete" color="white" _dark={{ color: 'white' }} />
                  </TouchableOpacity>
                </View>

                {plant.plant_profile.grow_properties.map((property) => (
                  <HStack space={3} flexShrink={1} w="100%">
                    <Text>
                      {property.grow_property_type.name}
                      :
                      {' '}
                      {property.min}
                      {' '}
                      {property.max}
                    </Text>
                  </HStack>
                ))}

                {plant.outdoor ? <Text style={styles.plantContainerText}>Outdoor</Text>
                  : <Text style={styles.plantContainerText}>Indoor</Text>}

                {plant.time_planted === null
                  ? <Text style={styles.plantContainerText}>Time planted: Not set</Text>
                  : (
                    <Text style={styles.plantContainerText}>
                      Time planted:
                      {new Date(plant.time_planted).toLocaleDateString()}
                    </Text>
                  )}

                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <TouchableOpacity style={styles.detailsButton} onPress={() => navigation.navigate('PlantDetails', { plant })}>
                    <Text style={styles.createText}>Plant Details</Text>
                  </TouchableOpacity>
                </View>

              </View>
            </>
          ))}
        </View>

      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  createPlantButton: {
    marginRight: 10,
    marginLeft: 120,
    marginTop: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 15,
    paddingLeft: 15,
    backgroundColor: '#1E6738',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
  },
  plantContainer: {
    borderColor: 'grey',
    borderWidth: 3,
    paddingBottom: 15,
    paddingLeft: 2,
    paddingRight: 2,
    width: '100%',
    marginBottom: 10,
    borderRadius: 10,
  },
  detailsButton: {
    marginRight: 5,
    marginLeft: 5,
    paddingTop: 10,
    paddingBottom: 10,
    paddingRight: 10,
    paddingLeft: 10,
    backgroundColor: '#1E3438',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1E6738',
    width: '40%',
    fontSize: 25,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createText: {
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantContainerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    marginHorizontal: 40,
    width: '100%',
    left: -40,
  },
});

export default PlantsScreen;
