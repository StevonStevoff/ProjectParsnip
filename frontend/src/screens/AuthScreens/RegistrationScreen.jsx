import React, { useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import { Formik } from 'formik';
import { ActivityIndicator } from 'react-native-paper';
import AuthUtils from '../../api/utils/AuthUtils';
import LoginSchema from '../../utils/validationSchema/AuthValidationScheme';

function RegistrationScreen({ navigation }) {
  const { colors } = useTheme();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <View style={colors.centeredView}>
      <Image
        source={require('../../../assets/backgroundBlob.png')}
        style={colors.blobImage}
      />
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '80%',
          maxHeight: '15%',
        }}
      >
        <Text style={colors.subtitle}> Create Account</Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={LoginSchema}
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            setIsLoading(true);
            AuthUtils.registerUser(navigation, values.email, values.password)
              .then(() => {
                setIsLoading(false);
                setSubmitting(false);
              })
              .catch((error) => {
                setIsLoading(false);
                setSubmitting(false);
                setFieldError('general', error);
              });
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <>
              <TextInput
                style={colors.textInput}
                placeholder="Email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
              />
              {errors.email && touched.email && (
                <Text style={{ color: 'red' }}>{errors.email}</Text>
              )}
              <TextInput
                style={colors.textInput}
                placeholder="Password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              {errors.password && touched.password && (
              <Text style={{ color: 'red' }}>{errors.password}</Text>
              )}
              {errors.general && (
                <Text style={{ color: 'red' }}>{errors.general}</Text>)}
              <View
                style={{
                  width: '70%',
                  marginTop: 20,
                  height: 50,
                }}
              >
                <LinearGradient
                  style={colors.loginBtn}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0.5, y: 0.5 }}
                  colors={['#B5EB89', '#529122']}
                >
                  <TouchableOpacity
                    style={colors.loginBtn}
                    onPress={handleSubmit}
                    disabled={isSubmitting || isLoading}
                  >
                    {isLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text
                        style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}
                      >
                        Sign Up →
                      </Text>
                    )}
                  </TouchableOpacity>
                </LinearGradient>
              </View>
            </>
          )}
        </Formik>
        <View
          style={{
            width: '70%',
            marginTop: 20,
            height: 50,
          }}
        >
          <TouchableOpacity
            style={colors.signupBtn}
            onPress={() => {
              navigation.navigate('Login');
            }}
          >
            <Text style={{ color: '#529122', fontSize: 20, fontWeight: 'bold' }}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default RegistrationScreen;
