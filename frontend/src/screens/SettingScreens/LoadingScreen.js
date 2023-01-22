import { View, Text, ActivityIndicator } from 'react-native'
import React, {useEffect} from 'react'
import { AuthUtils } from '../../api/utils/AuthUtils'

export const LoadingScreen = ({navigation}) => {
    useEffect(() => {
        //AuthUtils.isUserAuthenticated().then((loggedIn) => {
         // if(loggedIn){
         //   navigation.navigate('Navigation')
        //  }else{
        //    navigation.navigate('LoginScreen')
        //  }
        //)}

        navigation.navigate('LoginScreen')
      }, [])
  return (
    <View>
      <ActivityIndicator/>
    </View>
  )
}
