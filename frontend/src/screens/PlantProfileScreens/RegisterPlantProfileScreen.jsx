import {
  View, ScrollView, KeyboardAvoidingView, Platform,
} from 'react-native';
import React from 'react';
import {
  VStack,
} from 'native-base';
import { useHeaderHeight } from '@react-navigation/elements';
import CloseBtn from '../../components/CloseBtn';
import CreatePlantProfileForm from '../../components/CreatePlantProfileForm';

function RegisterPlantProfileScreen({ route, navigation }) {
  const createPlantProfileFormCont = (
    <VStack space={10} alignItems="center" width="99%" flex={1}>
      <ScrollView
        style={{ maxHeight: '100%', width: '100%' }}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
      >
        <View style={{
          width: '100%', height: '100%', justifyContent: 'center', padding: 10,
        }}
        >
          <CreatePlantProfileForm
            plantTypes={route.params.plantTypes}
            userData={route.params.userData}
          />
        </View>
      </ScrollView>
    </VStack>
  );
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

      {Platform.OS === 'web' ? (
        createPlantProfileFormCont
      ) : (
        <KeyboardAvoidingView
          behavior="padding"
          keyboardVerticalOffset={Platform.OS === 'ios' ? useHeaderHeight() : -200}
        >

          {createPlantProfileFormCont}
        </KeyboardAvoidingView>
      )}
    </View>
  );
}

export default RegisterPlantProfileScreen;
