import { ActivityIndicator, View } from 'react-native';
import React from 'react';
import {
  VStack
} from 'native-base';
import CloseBtn from '../../components/CloseBtn';
import CreatePlantForm from '../../components/CreatePlantForm';

function RegisterPlantScreen( {route,navigation} ) {

  // const { plantTypes } =props;
  // const { devices } =props;
  // const { plantProfiles }=props;
  
  // console.log('plantTypes:', plantTypes);
  // console.log('devices:', devices);
  // console.log('plantProfiles:', plantProfiles);
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
          padding: 25,
        }}
      >
        <CloseBtn navigation={navigation} />
      </View>


      <VStack space={10} alignItems="center" width="70%">
        <View style={{width:"100%",height:"100%", alignItems:"top"}}>  
          <CreatePlantForm plantTypes={route.params.plantTypes} plantProfiles={route.params.plantProfiles} devices={route.params.devices}/> 
        </View>
        
      </VStack>
    </View>
  );
}

export default RegisterPlantScreen;
