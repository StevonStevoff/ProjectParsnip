import {
  View, ScrollView, Platform,
} from 'react-native';
import {
  Text, Heading, VStack, Center, HStack, Divider,
} from 'native-base';
import React from 'react';
import CloseBtn from '../../components/CloseBtn';
import getIconComponent from '../../utils/SensorIcons';

function PlantProfileDetailsScreen({ route, navigation }) {
  return (
    <ScrollView>
      <View>

        <View
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            zIndex: 1,
          }}
        >
          <CloseBtn navigation={navigation} />
        </View>

        <Center alignContent="center" paddingTop={5}>
          <Heading>
            <Text color="#4da705">{route.params.plantProfile.name}</Text>
            {' '}
            <Text>Details</Text>
          </Heading>
          <VStack space={3} divider={<Divider />} w="90%">
            <HStack justifyContent="space-between">
              <Text>Name</Text>
              <Text>{route.params.plantProfile.name}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text>Description</Text>
              <Text>{route.params.plantProfile.description}</Text>
            </HStack>
            <HStack justifyContent="space-between">
              <Text>Grow Duration (days)</Text>
              <Text>{route.params.plantProfile.grow_duration}</Text>
            </HStack>

            <HStack justifyContent="space-between">
              <Text>Number of users</Text>
              <Text>{route.params.plantProfile.users.length}</Text>
            </HStack>

            <HStack justifyContent="space-between">
              <Text>Status</Text>
              {route.params.plantProfile.public === true
                ? <Text>Public</Text>
                : <Text>Private</Text>}
            </HStack>
          </VStack>
        </Center>

        <Center alignContent="center" paddingTop={5}>
          <Heading>
            <Text color="#4da705">Grow</Text>
            {' '}
            <Text>Properties</Text>
          </Heading>
          <VStack space={route.params.plantProfile.grow_properties.length} w="90%" paddingTop={5}>
            {route.params.plantProfile.grow_properties.map((property) => (
              <HStack key={property.id} justifyContent="space-between">
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
        </Center>

      </View>
    </ScrollView>

  );
}

export default PlantProfileDetailsScreen;
