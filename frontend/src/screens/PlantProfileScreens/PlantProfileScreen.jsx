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
  Button,
  Input,
  NativeBaseProvider, Center,
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
  const [changed, setChanged] = useState(false);

  const [searchPTTerm, setSearchPTTerm] = useState('');

  const [selectedButton, setSelectedButton] = useState('My Profiles');

  const [isLoading, setIsLoading] = useState(false);
  const handleButtonPress = (value) => {
    setSelectedButton(value);
  };
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
          let response;
          if (selectedButton === 'My Profiles') {
            response = await API.getAllPlantProfilesCreated();
            setPlantProfiles(response.data);
          } else if (selectedButton === 'Official') {
            response = await API.getAllPlantProfilesEverything();
            const filteredProfiles = response.data.filter(
              (profile) => !profile.user_created && profile.creator.id !== userData.id,
            );
            setPlantProfiles(filteredProfiles);
          } else if (selectedButton === 'Public') {
            response = await API.getAllPlantProfilesEverything();
            const filteredProfiles = response.data.filter(
              (profile) => profile.public && profile.creator.id !== userData.id, /// AJKSDHKJAS
            );
            setPlantProfiles(filteredProfiles);
          }
        } catch (error) {
          /* empty */
        } finally {
          console.log('Plant profiles fetched');
          setIsLoading(false);
        }
      };
      setIsLoading(true);
      fetchPlantsProfiles();

      return () => { /* empty */
      };
    }, [selectedButton, changed]),
  );

  if (userEmail == null) {
    return (
      <ActivityIndicator size="large" color="#00ff00" />
    );
  }

  const handleFavourite = async (value) => {
    const userIds = value.users.map((user) => user.id);
    const isUserExist = userIds.includes(userData.id);
    let updatedUsers;
    let peooe;
    if (isUserExist) {
      // User was found in the array, remove it
      updatedUsers = userIds.filter((id) => id !== userData.id);
      peooe = {
        id: value.id,
        user_ids: updatedUsers,
      };
    } else {
      // User was not found in the array, add it
      userIds.push(userData.id);
      peooe = {
        id: value.id,
        user_ids: userIds,
      };
    }
    try {
      await API.editPlantProfile(peooe);
      setChanged(!changed);
      setEvent('success');
    } catch (error) { setEvent('error'); }
  };

  const handleDelete = async (value) => {
    const userIds = value.users.map((user) => user.id);
    const updatedUsers = userIds.filter((id) => id !== userData.id);
    console.log(value.id);
    const peooe = {
      id: value.id,
      user_ids: [2],
    };
    try {
      const response = await API.editPlantProfile(peooe);
      console.log(response);
      setChanged(!changed);
      setEvent('success');
    } catch (error) { setEvent('error'); }
    // try {
    //   try {
    //     const propertiesArray = plantProfiles.filter(
    //       (plantProfile) => plantProfile.id === id,
    //     )[0].grow_properties;
    //     await Promise.all(
    //       propertiesArray.map(async (property) => {
    //         await API.deleteGrowProperty(property.id);
    //       }),
    //     );
    //   } catch (error) { /* empty */ }

    //   await API.deletePlantProfile(id).then(() => {
    //     setPlantProfiles(plantProfiles.filter((plantProfile) => plantProfile.id !== id));

    //     setEvent('success');
    //   });
    // } catch (error) { setEvent('error'); }
  };

  const filterPlantProfiles = (aSearchTerm) => {
    if (aSearchTerm === '') {
      return plantProfiles;
    }
    const filtered = plantProfiles.filter(
      (prof) => prof.name.toLowerCase().includes(aSearchTerm.toLowerCase()),
    );
    return filtered;
  };

  if (isLoading) {
    return (
      <NativeBaseProvider>
        <Center flex={1}>
          <ActivityIndicator size="large" color="#4da707" />
        </Center>
      </NativeBaseProvider>
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

        <HStack space={3}>
          <Button
            onPress={() => handleButtonPress('My Profiles')}
            style={{ margin: 10, borderRadius: 5 }}
            backgroundColor={selectedButton === 'My Profiles' ? '#00ff00' : 'transparent'}
          >
            <Text>My Profiles</Text>
          </Button>
          <Button
            onPress={() => handleButtonPress('Official')}
            style={{ margin: 10, borderRadius: 5 }}
            backgroundColor={selectedButton === 'Official' ? '#00ff00' : 'transparent'}
          >
            <Text>Official</Text>
          </Button>
          <Button
            onPress={() => handleButtonPress('Public')}
            style={{ margin: 10, borderRadius: 5 }}
            backgroundColor={selectedButton === 'Public' ? '#00ff00' : 'transparent'}
          >
            <Text>Public</Text>
          </Button>
        </HStack>

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

        <VStack space={2} alignItems="center" w="90%">
          <HStack space={3}>
            <Heading>Your Plant Profiles</Heading>
            <TouchableOpacity
              style={styles.detailsButton}
              onPress={() => navigation.navigate('RegisterPlantProfileScreen', { plantTypes, userData })}
            >
              <Icon as={MaterialIcons} name="add" color="white" _dark={{ color: 'white' }} />
            </TouchableOpacity>
          </HStack>

          <Input
            placeholder="Search Plant Profiles"
            value={searchPTTerm}
            onChangeText={(text) => {
              setSearchPTTerm(text);
            }}
            style={{ flex: 1, padding: 10 }}
            w="100%"
            size="2xl"
          />
        </VStack>

        <View style={{ width: '95%', paddingTop: 10 }}>
          {filterPlantProfiles(searchPTTerm).map((plantProfile) => (
            <View key={plantProfile.id} style={styles.plantContainer} backgroundColor={colorScheme === 'light' ? '#f3f3f3' : null}>

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

                {selectedButton === 'My Profiles' ? (
                // eslint-disable-next-line react/jsx-no-useless-fragment
                  <>
                    {plantProfile.creator.id !== userData.id ? (
                      <TouchableOpacity
                        style={styles.detailsButton}
                        onPress={() => handleFavourite(plantProfile)}
                      >
                        <Icon
                          as={MaterialIcons}
                          name="favorite"
                          color="white"
                          _dark={{ color: plantProfile.users.some((user) => user.id === userData.id) ? 'red.500' : 'white' }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <>
                        <TouchableOpacity
                          style={styles.detailsButton}
                          onPress={() => navigation.navigate('EditPlantProfileScreen', {
                            plantTypes, plantProfile,
                          })}
                        >
                          <Icon as={MaterialIcons} name="edit" color="white" _dark={{ color: 'white' }} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.detailsButton}
                          onPress={() => handleDelete(plantProfile)}
                        >
                          <Icon as={MaterialIcons} name="delete" color="white" _dark={{ color: 'white' }} />
                        </TouchableOpacity>

                      </>
                    )}
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.detailsButton}
                    onPress={() => handleFavourite(plantProfile)}
                  >
                    <Icon
                      as={MaterialIcons}
                      name="favorite"
                      color="white"
                      _dark={{ color: plantProfile.users.some((user) => user.id === userData.id) ? 'red.500' : 'white' }}
                    />
                  </TouchableOpacity>
                ) }

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
