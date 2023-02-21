import { View, Text } from 'react-native';
import React, { useEffect } from 'react';
import {
  Heading, ActivityIndicator, Stack, VStack, Flex, Pressable,
} from 'native-base';
import DevicesCard from '../../components/DevicesCard';
import DeviceUtils from '../../api/utils/DeviceUtils';

function DevicesScreen({ navigation}) {
  const [isLoading, setIsLoading] = React.useState(true);
  const [devices, setDevices] = React.useState();

  useEffect(() => {
    DeviceUtils.getAllUserDevices()
      .then((devicesObj) => {
        setDevices(devicesObj);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    isLoading ? (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    ) : (
      <View style={{
        flex: 1, width: '100%', height: '90%', justifyContent: 'center', alignItems: 'center',
      }}
      >
        <Heading size="lg" ml="-1">Devices</Heading>
        <View flex={1} flexWrap="wrap">
          {devices.map((device) => (
            <Pressable key={device.id} onPress={() => navigation.navigate('DevicesDetails', { device })}>
              <DevicesCard key={device.id} device={device} />
            </Pressable>
          ))}
        </View>
      </View>
    )
  );
}
export default DevicesScreen;
