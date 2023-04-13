import {
  Text, Box, Heading, HStack, VStack, IconButton, View, Icon, Avatar, Button, Spacer, Divider,
} from 'native-base';
import React from 'react';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import TempIcon from '../../components/icons/TempIcon';
import SoilMoistureIcon from '../../components/icons/SoilMoistureIcon';
import DewIcon from '../../components/icons/DewIcon';
import LightIcon from '../../components/icons/LightIcon';

function DevicesDetailsScreen(device) {
  return (
    <View style={{
      flex: 1, justifyContent: 'center', alignItems: 'center', height: '100%',
    }}
    >
      <Box
        height="90%"
        minHeight="90%"
        width="90%"
        minWidth="50%"
        rounded="sm"
        alignItems="center"
        justifyContent="center"
        overflow="hidden"
        borderColor="coolGray.200"
        borderWidth="1"
        _dark={{ borderColor: '#18181b', backgroundColor: '#18181b' }}
        _light={{ backgroundColor: 'gray.50' }}
      >
        <VStack width="90%">
          <VStack height="22%">
            <Heading size="xl" fontWeight={500} textAlign="center">Back Garden Peppers</Heading>
            <Text
              textAlign="center"
              color="gray.100"
              fontSize={14}
              fontWeight="semibold"
            >
              E8051 Series
            </Text>
          </VStack>

          <VStack
            rounded="lg"
            justifyContent="center"
            width="100%"
          //  _dark={{ borderColor: '#18181b', backgroundColor: '#2d2d30' }}
           // _light={{ backgroundColor: 'gray.50' }}
            p={5}
          >
            <HStack justifyContent="space-between">
              <Heading size="lg" fontWeight={500}>Sensors</Heading>
              <IconButton icon={<Icon as={MaterialIcons} name="add-circle" size="lg" color="white" />} />
            </HStack>
            <Divider />
            <VStack justifyContent="space-between" p={3}>
              <HStack justifyContent="space-between">
                <HStack justifyContent="space-evenly" space={2} alignItems="center">
                  <TempIcon />
                  <Heading size="sm">Temperature</Heading>
                </HStack>
                <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
              </HStack>
              <HStack justifyContent="space-between">
                <HStack justifyContent="space-evenly" space={2}>
                  <SoilMoistureIcon />
                  <Heading size="sm">Soil Moisture</Heading>
                </HStack>
                <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
              </HStack>
              <HStack justifyContent="space-between">
                <HStack alignItems="center" justifyContent="space-evenly" space={2}>
                  <DewIcon />
                  <Heading size="sm">Humidity</Heading>
                </HStack>
                <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
              </HStack>
              <HStack justifyContent="space-between">
                <HStack justifyContent="space-evenly" space={2}>
                  <LightIcon />
                  <Heading size="sm">Light</Heading>
                </HStack>
                <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
              </HStack>
            </VStack>
          </VStack>
          <VStack
            rounded="lg"
            justifyContent="center"
            width="100%"
            p={5}
            space={2}
          >
            <HStack justifyContent="space-between">
              <Heading size="lg" fontWeight={500}>Users</Heading>
              <IconButton icon={<Icon as={MaterialIcons} name="add-circle" size="lg" color="white" />} />
            </HStack>
            <Divider />
            <HStack justifyContent="space-between" alignItems="center" space={3}>
              <HStack justifyContent="flex-start" alignItems="center" space={3}>
                <Avatar size="md" source={{ uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80' }} />
                <Text color="coolGray.500">Aimee Boyle (Owner)</Text>
              </HStack>
              <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
            </HStack>
            <Spacer />
            <HStack justifyContent="flex-start" alignItems="center" space={3}>
              <Avatar size="md" source={{ uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80' }} />
              <Text color="coolGray.500">Jonh Doe</Text>
            </HStack>
          </VStack>
          <VStack
            rounded="lg"
            justifyContent="center"
            width="100%"
            p={5}
            space={2}
          >
            <HStack justifyContent="space-between">
              <Heading size="lg" fontWeight={500}>Plant</Heading>
              <IconButton icon={<Icon as={MaterialIcons} name="add-circle" size="lg" color="white" />} />
            </HStack>
            <Divider />
            <HStack justifyContent="space-between" alignItems="center" space={3}>
              <HStack justifyContent="flex-start" alignItems="center" space={3}>
                <Avatar size="md" source={{ uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80' }} />
                <Text color="coolGray.500">Aimee Boyle (Owner)</Text>
              </HStack>
              <IconButton icon={<Icon as={MaterialCommunityIcons} name="close" size="lg" />} />
            </HStack>
            <Spacer />
            <HStack justifyContent="flex-start" alignItems="center" space={3}>
              <Avatar size="md" source={{ uri: 'https://images.unsplash.com/photo-1510771463146-e89e6e86560e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=627&q=80' }} />
              <Text color="coolGray.500">Jonh Doe</Text>
            </HStack>
          </VStack>
          <VStack>
            <HStack justifyContent="space-between">
              <Heading size="md" fontWeight={500} color="primary.600">Plant</Heading>
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
