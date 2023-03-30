import React from 'react';
import {
  View, Text, StyleSheet, Platform,
} from 'react-native';
import { Heading } from 'native-base';
import ImageBackgroundBlob from '../../components/ImageBackgroundBlob';
import LoginForm from '../../components/LoginForm';

const LoginScreenStyles = StyleSheet.create({
  upperTextContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    width: '80%',
    maxHeight: '20%',

    ...Platform.select({
      web: {
        maxHeight: '0%',
        paddingBottom: 50,
      },
    }),
  },
  subtitle: {
    flexDirection: 'row',
    marginRight: '40%',
    fontSize: 45,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 22,
    fontWeight: 'semi-bold',
    marginLeft: 9,
    color: '#7d7f7e',
  },
});

function LoginScreen({ navigation }) {
  return (
    <View style={{
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    }}
    >
      <ImageBackgroundBlob />
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <View style={{ width: '80%', maxHeight: '20%' }}>
          <Heading size="xl">Login</Heading>
          <Heading size="lg" color="secondary.400">Please sign in to continue</Heading>
        </View>

        <LoginForm navigation={navigation} />
      </View>
    </View>
  );
}

export default LoginScreen;
