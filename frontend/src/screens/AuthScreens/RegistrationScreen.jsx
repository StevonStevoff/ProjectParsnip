import React from 'react';
import {
  View, StyleSheet, Platform,
} from 'react-native';
import { Heading } from 'native-base';
import ImageBackgroundBlob from '../../components/ImageBackgroundBlob';
import SignUpForm from '../../components/SignUpForm';

const SignUpScreenStyles = StyleSheet.create({
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
});

function RegistrationScreen({ navigation }) {
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
          <Heading size="xl">Create Account</Heading>
        </View>
        <SignUpForm navigation={navigation} />
      </View>
    </View>
  );
}

export default RegistrationScreen;
