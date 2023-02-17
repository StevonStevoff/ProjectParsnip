import {
  View, Text, TouchableOpacity, Platform, ActivityIndicator, StyleSheet,
} from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';

const AuthBtnsStyles = StyleSheet.create({
  primaryBtn: {
    borderRadius: 10,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        minWidth: '100%',
      },
    }),
  },
  secondaryBtn: {
    borderColor: '#B5EB89',
    borderRadius: 10,
    borderWidth: 1,
    minWidth: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      web: {
        minWidth: '0%',
        width: '100%',
      },
    }),
  },
});

function AuthBtns({
  btnName, handleSubmit, isSubmitting, isLoading, navigation,
}) {
  return (
    <>
      <View
        style={{
          width: '70%',
          marginTop: 20,
          height: 50,
        }}
      >
        <LinearGradient
          style={AuthBtnsStyles.primaryBtn}
          start={{ x: 0, y: 0 }}
          end={{ x: 0.5, y: 0.5 }}
          colors={['#B5EB89', '#529122']}
        >
          <TouchableOpacity
            style={AuthBtnsStyles.primaryBtn}
            onPress={handleSubmit}
            disabled={isSubmitting || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}
              >
                {btnName}
              </Text>
            )}
          </TouchableOpacity>
        </LinearGradient>
      </View>
      <View
        style={{
          width: '70%',
          marginTop: 20,
          height: 50,
        }}
      >
        <TouchableOpacity
          style={AuthBtnsStyles.secondaryBtn}
          testID="auth-btn"
          onPress={() => {
            if (btnName === 'Login →') {
              navigation.navigate('Registration');
            } else {
              navigation.navigate('LoginScreen');
            }
          }}

        >
          <Text style={{ color: '#529122', fontSize: 20, fontWeight: 'bold' }}>
            {btnName === 'Login →' ? 'Sign Up' : 'Login'}
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
}

export default AuthBtns;
