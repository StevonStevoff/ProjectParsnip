import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Formik } from 'formik';
import {
  Input, Icon, FormControl, Pressable, VStack,
} from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';
import AuthUtils from '../api/utils/AuthUtils';
import SignUpSchema from '../utils/validationSchema/SignUpSchema';
import AuthBtns from './AuthBtns';

function SignUpForm({ navigation }) {
  const [isFormLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <Formik
      initialValues={{
        email: '', password: '', confirmPassword: '', name: '', username: '',
      }}
      validationSchema={SignUpSchema}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        setIsLoading(true);
        AuthUtils.registerUser(
          navigation,
          values.email,
          values.password,
          values.name,
          values.username,
        )
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
          <VStack marginTop={5} width="90%">
            <FormControl isRequired isInvalid={errors.general}>
              <FormControl isRequired isInvalid={errors.name && touched.name} alignItems="center">
                <Input
                  w="80%"
                  size="2xl"
                  marginBottom="3%"
                  InputLeftElement={<Icon as={<MaterialIcons name="person" />} size={5} ml="2" color="muted.400" />}
                  placeholder="Name"
                  variant="filled"
                  onChangeText={handleChange('name')}
                  onBlur={handleBlur('name')}
                  value={values.name}
                />
                <FormControl.ErrorMessage>
                  {errors.name}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.username && touched.username} alignItems="center">
                <Input
                  w="80%"
                  size="2xl"
                  marginBottom="3%"
                  InputLeftElement={<Icon as={<MaterialIcons name="alternate-email" />} size={5} ml="2" color="muted.400" />}
                  placeholder="Username"
                  variant="filled"
                  onChangeText={handleChange('username')}
                  onBlur={handleBlur('username')}
                  value={values.username}
                />
                <FormControl.ErrorMessage>
                  {errors.username}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.email && touched.email} alignItems="center">
                <Input
                  w="80%"
                  size="2xl"
                  marginBottom="3%"
                  InputLeftElement={<Icon as={<MaterialIcons name="mail" />} size={5} ml="2" color="muted.400" />}
                  placeholder="Email"
                  variant="filled"
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                />
                <FormControl.ErrorMessage>
                  {errors.email}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.password && touched.password} alignItems="center">
                <Input
                  w="80%"
                  size="2xl"
                  marginBottom="3%"
                  type={showPassword ? 'text' : 'password'}
                  InputLeftElement={<Icon as={<MaterialIcons name="lock" />} size={5} ml="2" color="muted.400" />}
                  placeholder="Password"
                  variant="filled"
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  InputRightElement={(
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Icon as={<MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} />} size={5} mr="2" color="muted.400" />
                    </Pressable>
)}
                />
                <FormControl.ErrorMessage>
                  {errors.password}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl isRequired isInvalid={errors.confirmPassword && touched.confirmPassword} alignItems="center">
                <Input
                  w="80%"
                  size="2xl"
                  marginBottom="3%"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  InputLeftElement={<Icon as={<MaterialIcons name="lock" />} size={5} ml="2" color="muted.400" />}
                  variant="filled"
                  onChangeText={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  value={values.confirmPassword}
                  InputRightElement={(
                    <Pressable onPress={() => setShowPassword(!showPassword)}>
                      <Icon as={<MaterialIcons name={showPassword ? 'visibility' : 'visibility-off'} />} size={5} mr="2" color="muted.400" />
                    </Pressable>
)}
                />
                <FormControl.ErrorMessage>
                  {errors.confirmPassword}
                </FormControl.ErrorMessage>
              </FormControl>
              <FormControl.ErrorMessage>{errors.general}</FormControl.ErrorMessage>
            </FormControl>
          </VStack>
          <View
            style={{
              flexDirection: 'row-reverse',
              alignItems: 'flex-end',
              width: '75%',
              marginTop: 9,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate('ForgotPassword');
              }}
            >
              <Text
                style={{
                  color: '#4a8022',
                  fontWeight: 'semi-bold',
                  fontSize: 15,
                }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <AuthBtns btnName="Sign Up →" handleSubmit={handleSubmit} isSubmitting={isSubmitting} isLoading={isFormLoading} navigation={navigation} />
        </>
      )}
    </Formik>
  );
}

export default SignUpForm;
