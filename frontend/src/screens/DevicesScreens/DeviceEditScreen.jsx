import { View } from 'react-native';
import React from 'react';
import { HStack, Button, Icon } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import DeviceEditForm from '../../components/DevicesEditForm';

function DeviceEditScreen({ navigation, route }) {
  const device = route?.params?.device || {};
  const editDevice = route?.params?.setDevice || (() => {});
  return (
    <View style={{
      flex: 1,
      alignItems: 'center',
      width: '100%',
      height: '90%',
    }}
    >
      <HStack justifyContent="space-between" width="100%">
        <Button
          onPress={() => navigation.goBack()}
          variant="unstyled"
        >
          <Icon
            as={Ionicons}
            name="arrow-back"
            _dark={{ color: 'white' }}
            _light={{ color: 'grey.200' }}
            size="lg"
          />
        </Button>
      </HStack>
      <DeviceEditForm navigation={navigation} device={device} editDevice={editDevice} />
    </View>
  );
}

export default DeviceEditScreen;
