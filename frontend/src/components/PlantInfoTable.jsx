import React from 'react';
import {
  VStack, HStack, Text, Spacer, Heading, Divider,
} from 'native-base';
import { useWindowDimensions } from 'react-native';

function PlantInfoTable({ plantName, plantProfileName, plantType }) {
  const screenWidth = useWindowDimensions().width;
  const isScreenSmall = screenWidth < 700;
  console.log(screenWidth);
  console.log(isScreenSmall);

  if (plantName === '') {
    return (
      <VStack
        rounded="lg"
        justifyContent="center"
        width="100%"
        p={5}
      >
        <HStack justifyContent="space-between" space={2}>
          <Heading size="lg" fontWeight={500}>Linked Plant</Heading>
        </HStack>
        <Divider />
        <VStack justifyContent="space-between" p={3}>
          <HStack space={6} justifyContent="center">
            <Text>Switch to the plant type to create a plant and link this device. </Text>
          </HStack>
        </VStack>
      </VStack>
    );
  }

  if (isScreenSmall) {
    return (
      <VStack
        rounded="lg"
        justifyContent="center"
        width="100%"
        p={5}
      >
        <HStack justifyContent="space-between" space={2}>
          <Heading size="lg" fontWeight={500}>Linked Plant</Heading>
        </HStack>
        <Divider />
        <VStack justifyContent="space-between" p={3}>
          <HStack space={6} justifyContent="space-between">
            <Text fontWeight="bold">Plant Name</Text>
            <Text>{plantName}</Text>
          </HStack>
          <HStack space={6} justifyContent="space-between">
            <Text fontWeight="bold">Plant Profile</Text>
            <Text>{plantProfileName}</Text>
          </HStack>
          <HStack space={6} justifyContent="space-between">
            <Text fontWeight="bold">Plant Type</Text>
            <Text>{plantType}</Text>
          </HStack>
        </VStack>
      </VStack>
    );
  }

  return (
    <VStack
      rounded="lg"
      justifyContent="center"
      width="100%"
      p={5}
    >
      <HStack justifyContent="space-between" space={2}>
        <Heading size="lg" fontWeight={500}>Linked Plant</Heading>
      </HStack>
      <Divider />
      <VStack justifyContent="space-between" p={3} width="100%">
        <HStack
          space={4}
          width="100%"
          justifyContent="space-evenly"
          flexWrap="wrap"
        >
          <Text fontWeight="bold" flex={1} maxWidth={100}>
            Plant Name
          </Text>
          <Text fontWeight="bold" flex={1} maxWidth={100}>
            Plant Profile
          </Text>
          <Text fontWeight="bold" flex={1} maxWidth={100}>
            Plant Type
          </Text>
        </HStack>
        <Spacer />
        <HStack
          space={4}
          width="100%"
          justifyContent="space-evenly"
          flexWrap="wrap"
        >
          <Text flex={1} maxWidth={100}>
            {plantName}
          </Text>
          <Text flex={1} maxWidth={100}>
            {plantProfileName}
          </Text>
          <Text flex={1} maxWidth={100}>
            {plantType}
          </Text>
        </HStack>
      </VStack>
    </VStack>

  );
}

export default PlantInfoTable;
