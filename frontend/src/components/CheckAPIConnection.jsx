import {
  VStack, Heading, Text, Button,
} from 'native-base';
import React from 'react';

function CheckAPIConnection({ onRetry }) {
  return (
    <VStack alignItems="center" justifyContent="center" space={4} flex={1}>
      <Heading textAlign="center" color="black">Server Connection Error</Heading>
      <Text textAlign="center" color="black">
        There was an issue connecting to the server. Please try again later.
      </Text>
      <Button onPress={onRetry}>Try Again</Button>
    </VStack>
  );
}

export default CheckAPIConnection;
