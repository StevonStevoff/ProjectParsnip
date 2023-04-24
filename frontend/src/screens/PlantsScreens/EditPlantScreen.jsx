import { View, ScrollView, KeyboardAvoidingView } from 'react-native';
import React from 'react';
import {
  VStack,
} from 'native-base';
import { useHeaderHeight } from '@react-navigation/elements';
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

      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={useHeaderHeight()}
      >
        <VStack space={1} alignItems="center" width="99%" flex={1} justifyContent="center">
          <ScrollView
            style={{ maxHeight: '100%', width: '100%' }}
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
          >
            <View style={{
              width: '100%', height: '100%', padding: 10, justifyContent: 'center',
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
      </KeyboardAvoidingView>
    </View>
  );
}

export default EditPlantScreen;
