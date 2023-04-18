import { View, ScrollView } from 'react-native';
import React from 'react';
import {
  VStack,
} from 'native-base';
import CloseBtn from '../../components/CloseBtn';
import EditPlantForm from '../../components/EditPlantForm';

function EditPlantScreen({ route, navigation }) {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
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

      <VStack space={10} alignItems="center" width="90%">
        <ScrollView style={{ maxHeight: '100%', width: '100%' }}>
          <View style={{
            width: '100%', height: '100%', alignItems: 'top', padding: 10,
          }}
          >
            <EditPlantForm
              plantTypes={route.params.plantTypes}
              plantProfiles={route.params.plantProfiles}
              devices={route.params.devices}
              plant={route.params.plant}
            />
          </View>
        </ScrollView>
      </VStack>
    </View>
  );
}

export default EditPlantScreen;
