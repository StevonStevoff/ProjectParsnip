import { View } from 'react-native';
import React from 'react';
import { Heading } from 'native-base';
import DevicesCard from '../../components/DevicesCard';

function DevicesScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Heading
          size="xl"
          style={{ }}
        >
          Devices

        </Heading>
        <DevicesCard />
      </View>
    </View>
  );
}

export default DevicesScreen;
