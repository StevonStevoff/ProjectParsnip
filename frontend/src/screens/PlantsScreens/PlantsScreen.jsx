import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Appearance,
  Platform,
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
  Divider,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import PlantUtils from '../../api/utils/PlantUtils';
import API from '../../api/API';
import getIconComponent from '../../utils/SensorIcons';

function PlantsScreen({ navigation }) {
  const colorScheme = Appearance.getColorScheme();

  const [userEmail, setUserEmail] = useState('');
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantsTypes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [plantProfiles, setPlantProfiles] = useState([]);
  const [latestValue, setLatestValue] = useState(null);

  const statusArray = [{
    status: 'success',
    title: 'Plant successfully deleted!',
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
    PlantUtils.getAuthenticatedUserData().then((email) => {
      setUserEmail(email);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPlants = async () => {
        try {
          const response = await API.getCurrentUsersPlants();
          setPlants(response.data);
        } catch (error) { /* empty */ }
      };
      fetchPlants();

      return () => { /* empty */
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

  // Get latest value for each grow property type for each plant
  useEffect(() => {
    const fetchLatestValues = async () => {
      try {
        const plantIds = plants.map((plant) => plant.id); // replace with your desired plant ids
        const growPropertyTypeIds = [1, 2, 3, 4];
        const latestValues = {};

        await Promise.all(plantIds.map(async (id) => {
          latestValues[id] = {};
          try {
            const response = await API.getPlantData(id);

            growPropertyTypeIds.forEach((growPropertyTypeId) => {
              const data = response.data.filter((item) => item.sensor_readings.some(
                (reading) => reading.grow_property.grow_property_type.id === growPropertyTypeId,
              ));
              const latestRecord = data.length > 0 ? data.reduce(
                (prev, current) => (prev.timestamp > current.timestamp ? prev : current),
              ) : null;
              latestValues[id][growPropertyTypeId] = latestRecord === null
                ? -999 : latestRecord.sensor_readings[0].value;
            });
          } catch (error) {
            if (error.response && error.response.status === 404) {
              latestValues[id] = {
                1: -999, 2: -999, 3: -999, 4: -999,
              };
            } else {
              throw error; // re-throw other errors
            }
          }
        }));

        setLatestValue(latestValues);
      } catch (error) { /* empty */ }
    };
    fetchLatestValues();
  }, [plants]);

  useEffect(() => {
    const fetchPlantsProfiles = async () => {
      try {
        const response = await API.getAllPlantProfiles();
        setPlantProfiles(response.data);
      } catch (error) { /* empty */ }
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

  // console.log(Object.keys(latestValue).length)
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

        <HStack space={3}>
          <Heading>Your Plants</Heading>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('RegisterPlantScreen', { plantTypes, plantProfiles, devices })}
          >
            <Icon as={MaterialIcons} name="add" color="white" _dark={{ color: 'white' }} />
          </TouchableOpacity>
        </HStack>

        <View style={{ width: '95%' }}>
          {plants.map((plant) => (
            <>
              <Heading style={{ fontSize: 25, padding: 7, fontWeight: 'bold' }} key={plant.id}>{plant.name}</Heading>
              <View style={styles.plantContainer} backgroundColor={colorScheme === 'light' ? '#f3f3f3' : null}>

                <View style={{ flexDirection: 'row', padding: 10, width: '100%' }}>
                  <Text
                    style={{
                      fontSize: Platform.OS === 'web' ? 20 : 14, color: '#4da705', flex: 3, fontWeight: 'bold',
                    }}
                    key={plant.id}
                  >
                    {plant.plant_type.name}
                    {' · '}
                    {plant.plant_profile.name}
                    {' · '}
                    {plant.device.name}
                  </Text>
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => navigation.navigate('EditPlantScreen', {
                      plantTypes, plantProfiles, devices, plant,
                    })}
                  >
                    <Icon as={MaterialIcons} name="edit" color="white" _dark={{ color: 'white' }} />
                  </TouchableOpacity>
                  {/* To be Changed to handleEdit */}
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => handleDelete(plant.id)}
                  >
                    <Icon as={MaterialIcons} name="delete" color="white" _dark={{ color: 'white' }} />
                  </TouchableOpacity>
                </View>

                <HStack w="100%">
                  <VStack w="50%" style={styles.plantDetailsContianer} paddingRight={1}>
                    <Text fontSize={Platform.OS === 'web' ? 18 : 15} style={styles.plantContainerText}>
                      {' '}
                      {plant.outdoor ? 'Outdoor' : 'Indoor'}
                    </Text>

                    <HStack w="100%" style={styles.plantDetailsContianer}>
                      <Text fontSize={Platform.OS === 'web' ? 18 : 10} style={styles.plantContainerText}> Time planted: </Text>
                      {plant.time_planted === null
                        ? <Text style={styles.plantContainerText}> Not set</Text>
                        : (
                          <Text fontSize={Platform.OS === 'web' ? 18 : 15} style={styles.plantContainerText}>
                            {new Date(plant.time_planted).toLocaleDateString()}
                          </Text>
                        )}
                    </HStack>
                  </VStack>
                  <Divider my={1} orientation="vertical" />
                  <VStack space={plant.plant_profile.grow_properties.length} w="40%" paddingLeft={1}>
                    {plant.plant_profile.grow_properties.map((property) => (
                      <HStack justifyContent="space-between">
                        <View w="20%" marginBottom={10}>
                          {(() => getIconComponent(property.grow_property_type.description))()}
                        </View>

                        <Text fontSize={15}>
                          {property.min}
                        </Text>
                        <HStack style={{ marginBottom: 1 }}>
                          {(latestValue?.[plant.id]?.[property.grow_property_type.id] >= property.max
                            || latestValue?.
                              [plant.id]?.[property.grow_property_type.id] <= property.min)
                            ? (

                              <>
                                <Text fontSize={Platform.OS === 'web' ? 18 : 13} style={{ color: 'red', fontWeight: 'bold', marginTop: 1 }}>
                                  {latestValue?.
                                    [plant.id]?.[property.grow_property_type.id] === -999
                                    ? 'N/A'
                                    : latestValue?.[plant.id]?.[property.grow_property_type.id]}
                                </Text>
                                <Icon as={MaterialIcons} name="priority-high" color="red.600" _dark={{ color: 'red.600' }} size={5} />

                              </>

                            )
                            : (
                              <Text fontSize={Platform.OS === 'web' ? 18 : 15} style={{ color: 'green', fontWeight: 'bold' }}>
                                {latestValue?.[plant.id]?.[property.grow_property_type.id]}
                              </Text>
                            )}
                        </HStack>
                        <Text fontSize={15}>
                          {property.max}
                        </Text>

                      </HStack>
                    ))}
                  </VStack>

                </HStack>

                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                  <TouchableOpacity style={styles.plantDetailsButton} onPress={() => navigation.navigate('PlantDetails', { plant })}>
                    <Text style={styles.createText}>  Plant Details  </Text>
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
  plantContainer: {
    backgroundColor: '#262626',
    paddingBottom: 15,
    paddingLeft: 2,
    paddingRight: 2,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  detailsButton: {
    marginRight: 5,
    marginLeft: 5,
    padding: 10,
    backgroundColor: '#1E3438',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#1E6738',
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    height: 40,
    width: 40,
  },
  plantDetailsButton: {
    marginRight: 5,
    marginLeft: 5,
    marginTop: 10,
    padding: 10,
    backgroundColor: '#1E3438',
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#1E6738',
    fontSize: 25,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  createText: {
    color: '#fff',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantDetailsContianer: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  plantContainerText: {
    fontWeight: 'bold',
    paddingBottom: 5,
  },
  scrollView: {
    marginHorizontal: 40,
    width: '100%',
    left: -40,
  },
  propertyTypesConatiner: {
    width: '100%',
    padding: 20,
    borderColor: 'grey',
    textAlign: 'center',
    justifyContent: 'left',
    alignItems: 'center',
  },
});

export default PlantsScreen;
