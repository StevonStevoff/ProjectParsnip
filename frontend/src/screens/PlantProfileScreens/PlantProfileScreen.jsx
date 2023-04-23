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
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import PlantUtils from '../../api/utils/PlantUtils';
import API from '../../api/API';
import getIconComponent from '../../utils/SensorIcons';

function PlantProfileScreen({ navigation }) {
  const colorScheme = Appearance.getColorScheme();

  const [userEmail, setUserEmail] = useState('');
  const [userData, setUserData] = useState([]);
  const [plantTypes, setPlantsTypes] = useState([]);
  const [plantProfiles, setPlantProfiles] = useState([]);

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
    PlantUtils.getAuthenticatedUser().then((email) => {
      setUserEmail(email);
    });
  }, []);

  useEffect(() => {
    PlantUtils.getAuthenticatedUserData().then((data) => {
      setUserData(data);
    });
  }, []);

  useEffect(() => {
    const fetchPlantsTypes = async () => {
      try {
        const response = await API.getAllPlantTypes();
        setPlantsTypes(response.data);
      } catch (error) { /* empty */ }
    };
    fetchPlantsTypes();
  }, []);

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

  if (userEmail == null) {
    return (
      <ActivityIndicator size="large" color="#00ff00" />
    );
  }

  const handleDelete = async (id) => {
    try {
      try {
        const propertiesArray = plantProfiles.filter(
          (plantProfile) => plantProfile.id === id,
        )[0].grow_properties;
        console.log(propertiesArray);
        await Promise.all(
          propertiesArray.map(async (property) => {
            await API.deleteGrowProperty(property.id);
          }),
        );
      } catch (error) { /* empty */ }

      await API.deletePlantProfile(id).then(() => {
        setPlantProfiles(plantProfiles.filter((plantProfile) => plantProfile.id !== id));

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

        <HStack space={3}>
          <Heading>Your Plant Profiles</Heading>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() => navigation.navigate('RegisterPlantProfileScreen', { plantTypes, userData })}
          >
            <Icon as={MaterialIcons} name="add" color="white" _dark={{ color: 'white' }} />
          </TouchableOpacity>
        </HStack>

        <View style={{ width: '95%', paddingTop: 10 }}>
          {plantProfiles.map((plantProfile) => (
            <View style={styles.plantContainer} backgroundColor={colorScheme === 'light' ? '#f3f3f3' : null}>

              <View style={{ flexDirection: 'row', padding: 10, width: '100%' }}>
                <Heading
                  style={{
                    fontSize: 20, color: '#4da705', flex: 3, fontWeight: 'bold',
                  }}
                  key={plantProfile.id}
                >
                  {plantProfile.name}
                  {' · '}
                  {plantProfile.plant_type.name}
                </Heading>
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => navigation.navigate('EditPlantProfileScreen', {
                    plantTypes, plantProfile,
                  })}
                >
                  <Icon as={MaterialIcons} name="edit" color="white" _dark={{ color: 'white' }} />
                </TouchableOpacity>
                {/* To be Changed to handleEdit */}
                <TouchableOpacity
                  style={styles.detailsButton}
                  onPress={() => handleDelete(plantProfile.id)}
                >
                  <Icon as={MaterialIcons} name="delete" color="white" _dark={{ color: 'white' }} />
                </TouchableOpacity>
              </View>

              <VStack space={plantProfile.grow_properties.length} w="90%">
                {plantProfile.grow_properties.map((property) => (
                  <HStack justifyContent="space-between">
                    <View w="30%">
                      {(() => getIconComponent(property.grow_property_type.description))()}
                    </View>

                    <Text fontSize={Platform.OS === 'web' ? 'md' : 'sm'} w="30%">
                      {property.grow_property_type.name}
                    </Text>
                    <Text w="10%">→</Text>
                    <Text w="20%">
                      {property.min}
                    </Text>
                    <Text w="20%">-</Text>
                    <Text w="20%">
                      {property.max}
                    </Text>
                  </HStack>
                ))}
              </VStack>

              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <TouchableOpacity style={styles.detailsButton} onPress={() => navigation.navigate('PlantDetails', { plant })}>
                  <Text style={styles.createText}> Plant Profile Details  </Text>
                </TouchableOpacity>
              </View>

            </View>
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
    fontSize: 20,
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default PlantProfileScreen;
