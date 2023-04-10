import {
  Text, Box, Heading, HStack, VStack, IconButton, View, Icon, Avatar, Button, Spacer,
} from 'native-base';
import React from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import TempIcon from '../../components/icons/TempIcon';
import SoilMoistureIcon from '../../components/icons/SoilMoistureIcon';
import DewIcon from '../../components/icons/DewIcon';
import LightIcon from '../../components/icons/LightIcon';

// eslint-disable-next-line no-unused-vars
function DevicesDetailsScreen(device) {
  return (
    <View style={{
      flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%',
    }}
    >
      <Box
        width="100%"
        minWidth="50%"
        rounded="sm"
        alignItems="center"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{
          borderColor: '#18181b',
          backgroundColor: '#18181b',
        }}
        _web={{
          shadow: 2,
          borderWidth: 0,
        }}
        _light={{
          backgroundColor: 'gray.50',
        }}
      >
        <VStack size={4} width="95%" alignItem="center">

          <VStack size={4} width="95%" alignItem="center">
            <Heading size="xl" ml="-1" fontWeight={500} alignItems="center">Back Garden Peppers</Heading>
            <Text alignItem="center" color="coolGray.500">E8051 Series</Text>
          </VStack>

          <HStack justifyContent="space-between">
            <Heading size="md" ml="-1" fontWeight={500} color="primary.600">Sensors</Heading>
            <IconButton icon={<Icon as={MaterialIcons} name="add-circle" size="lg" />} />
          </HStack>
          <HStack justifyContent="space-between">
            <HStack justifyContent="space-evenly" space={2} alignItem="center">
              <TempIcon alignItem="center" />
              <Heading alignItem="center" size="sm" ml="-1">Temperature</Heading>
            </HStack>
            <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
          </HStack>
          <HStack justifyContent="space-between">
            <HStack justifyContent="space-evenly" space={2}>
              <SoilMoistureIcon alignItem="center" />
              <Heading alignItem="center" size="sm" ml="-1">Soil Moisture</Heading>
            </HStack>
            <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
          </HStack>
          <HStack justifyContent="space-between">
            <HStack alignItem="center" justifyContent="space-evenly" space={2}>
              <DewIcon alignItem="center" />
              <Heading alignItem="center" size="sm" ml="-1">Humidity</Heading>
            </HStack>
            <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
          </HStack>
          <HStack justifyContent="space-between">
            <HStack justifyContent="space-evenly" space={2}>
              <LightIcon />
              <Heading size="sm" ml="-1">Light</Heading>
            </HStack>
            <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
          </HStack>
          <HStack justifyContent="space-between">
            <Heading size="md" ml="-1" fontWeight={500} color="primary.600">Users</Heading>
            <IconButton icon={<Icon as={MaterialIcons} name="add-circle" size="lg" />} />
          </HStack>
          <HStack justifyContent="flex-start" alignItems="center" space={3}>
            <Avatar space={2} size="md" source={{ uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80' }} />
            <Text alignItem="center" color="coolGray.500">Aimee Boyle (Owner)</Text>
          </HStack>
          <Spacer />
          <HStack justifyContent="flex-start" alignItems="center" space={3}>
            <Avatar space={2} size="md" source={{ uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80' }} />
            <Text alignItem="center" color="coolGray.500">Jonh Doe</Text>
          </HStack>
          <Spacer />
          <Spacer />
          <VStack size={2} width="90%" alignItem="center">
            <HStack justifyContent="space-between">
              <Heading size="md" ml="-1" fontWeight={500} color="primary.600">Plant</Heading>
              <Button
                bg="error.600"
                _hover={{ bg: 'error.700' }}
                size="sm"
              >
                Unlink

              </Button>
            </HStack>
            <Spacer />
            <Text> Pepper Plant </Text>
            <Spacer />
            <Text> Pepper Profile </Text>
          </VStack>
        </VStack>
      </Box>
    </View>
  );
}

export default DevicesDetailsScreen;
