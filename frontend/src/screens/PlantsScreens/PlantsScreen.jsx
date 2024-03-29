import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  Appearance,
  Platform,
} from 'react-native';
import React, { useEffect, useState, useMemo } from 'react';
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
  Center,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import PlantUtils from '../../api/utils/PlantUtils';
import API from '../../api/API';
import getIconComponent from '../../utils/SensorIcons';
import WarningDialog from '../../components/WarningDialog';

function PlantsScreen({ navigation }) {
  const colorScheme = Appearance.getColorScheme();

  const [userEmail, setUserEmail] = useState('');
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantsTypes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [plantProfiles, setPlantProfiles] = useState([]);
  const [latestValue, setLatestValue] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);
  const [plantDeletedId, setPlantDeletedId] = useState(0);

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

  const handleDeleteClose = () => {
    setIsWarningDialogOpen(false);
  };

  useEffect(() => {
    PlantUtils.getAuthenticatedUserData().then((email) => {
      setUserEmail(email);
    });
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPlants = async () => {
        setIsLoading(true);
        try {
          const response = await API.getCurrentUsersPlants();
          setPlants(response.data);
        } catch (error) { /* empty */ } finally {
          setIsLoading(false);
        }
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
  useMemo(() => {
    const fetchLatestValues = async () => {
      setIsLoading(true);
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
      } catch (error) { /* empty */ } finally {
        setIsLoading(false);
      }
    };
    fetchLatestValues();
  }, [plants]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchPlantsProfiles = async () => {
        try {
          const response = await API.getAllPlantProfiles();
          setPlantProfiles(response.data);
        } catch (error) { /* empty */ }
      };
      fetchPlantsProfiles();

      return () => { /* empty */
      };
    }, []),
  );

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

  const handleDelete = async () => {
    setIsWarningDialogOpen(false);
    try {
      await API.deletePlant(plantDeletedId).then(() => {
        setPlants(plants.filter((plant) => plant.id !== plantDeletedId));
        setEvent('success');
      });
    } catch (error) { setEvent('error'); }
  };

  const isInRange = (plantIdValue, growPropertyTypeId, propMin, propMax) => (
    latestValue?.[plantIdValue]?.[growPropertyTypeId] >= propMax
  || latestValue?.[plantIdValue]?.[growPropertyTypeId] <= propMin
  || latestValue?.[plantIdValue]?.[growPropertyTypeId] === undefined);

  const isAValue = (plantIdValue, growPropertyTypeId) => (
    latestValue?.[plantIdValue]?.[growPropertyTypeId] === -999
  || latestValue?.[plantIdValue]?.[growPropertyTypeId] === undefined);

  if (isLoading) {
    return (
      <Center flex={1}>
        <ActivityIndicator size="large" color="#00ff00" />
      </Center>
    );
  }

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

        <WarningDialog
          isOpen={isWarningDialogOpen}
          onClose={handleDeleteClose}
          onConfirm={handleDelete}
          warningMessage="Are you sure you want to delete this plant? This action cannot be undone."
          headerMessage="Delete Plant"
          actionBtnText="Delete"
        />
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
            onPress={() => navigation.navigate('RegisterPlantScreen', {
              plantTypes, plantProfiles, devices,
            })}
          >
            <Icon as={MaterialIcons} name="add" color="white" _dark={{ color: 'white' }} />
          </TouchableOpacity>
        </HStack>

        <View style={{ width: '95%', ...styles.mainAllPlantaContainer }}>
          {plants.map((plant) => (
            <View
              key={plant.id}
              style={
              styles.plantContainerButton
            }
            >
              <Heading style={{ fontSize: 25, padding: 7, fontWeight: 'bold' }} key={plant.id}>{plant.name}</Heading>
              <TouchableOpacity onPress={() => navigation.navigate('PlantDetails', { plant })}>
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
                      onPress={() => { setIsWarningDialogOpen(true); setPlantDeletedId(plant.id); }}
                    >
                      <Icon as={MaterialIcons} name="delete" color="white" _dark={{ color: 'white' }} />
                    </TouchableOpacity>
                  </View>

                  <HStack w="100%" h={Platform.OS === 'web' ? 220 : null}>
                    <VStack w="50%" style={styles.plantDetailsContianer} paddingRight={1}>
                      <Text fontSize={Platform.OS === 'web' ? 18 : 15} style={styles.plantContainerText}>
                        {' '}
                        {plant.outdoor ? 'Outdoor' : 'Indoor'}
                      </Text>

                      <HStack w="100%" style={styles.plantDetailsContianer}>
                        <Text fontSize={Platform.OS === 'web' ? '2vh' : 10} style={styles.plantContainerText}> Time planted: </Text>
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
                      <HStack justifyContent="space-between">
                        <Text w="19%" />
                        <Text fontSize={11}>
                          Min
                        </Text>
                        <Text fontSize={12}>
                          Current
                        </Text>
                        <Text fontSize={11}>
                          Max
                        </Text>
                      </HStack>
                      {plant.plant_profile.grow_properties.map((property) => (
                        <HStack key={property.id} justifyContent="space-between">
                          <View w="20%">
                            {(() => getIconComponent(property.grow_property_type.description))()}
                          </View>

                          <Text fontSize={15}>
                            {property.min}
                          </Text>
                          <HStack style={{ marginBottom: 1 }}>
                            {isInRange(
                              plant.id,
                              property.grow_property_type.id,
                              property.min,
                              property.max,
                            )
                              ? (
                                <>
                                  <Text fontSize={Platform.OS === 'web' ? 18 : 13} style={{ color: 'red', fontWeight: 'bold', marginTop: -3 }}>
                                    {isAValue(plant.id, property.grow_property_type.id)
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
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </View>

      </View>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  mainAllPlantaContainer: {
    ...Platform.select({
      web: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
      },
      default: {
      },
    }),
  },
  plantContainerButton: {
    ...Platform.select({
      web: {
        padding: 10,
        flexGrow: 1,
        minWidth: 450,
        maxWidth: 600,
        flexBasis: 0,
      },
      default: {
      },
    }),
  },
  plantContainer: {
    backgroundColor: '#262626',
    paddingBottom: 15,
    paddingLeft: 2,
    paddingRight: 2,
    width: '100%',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    height: Platform.OS === 'web' ? 310 : null,
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
});

export default PlantsScreen;
