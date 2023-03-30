import { View, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react';

function LoadingScreen({ navigation }) {
  useEffect(() => {
    // AuthUtils.isUserAuthenticated().then((loggedIn) => {
    // if(loggedIn){
    //   navigation.navigate('Navigation')
    //  }else{
    //    navigation.navigate('LoginScreen')
    //  }
    // )}

    navigation.navigate('LoginScreen');
  }, []);
  return (
    <View>
      <ActivityIndicator />
    </View>
  );
}

export default LoadingScreen;
