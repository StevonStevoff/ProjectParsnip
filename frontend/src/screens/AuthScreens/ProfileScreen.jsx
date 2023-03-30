import { ActivityIndicator, View } from 'react-native';
import React from 'react';
import {
  VStack, FormControl, Input, Button, Text,
} from 'native-base';
import { Formik } from 'formik';
import ProfilePicture from '../../components/ProfilePicture';
import AuthUtils from '../../api/utils/AuthUtils';
import CloseBtn from '../../components/CloseBtn';
import profileSchema from '../../utils/validationSchema/ProfileSchema';

function ProfileScreen({ navigation }) {
  const [user, setUser] = React.useState({ name: '', username: '', email: '' });
  const [editMode, setEditMode] = React.useState(false);
  const [isFormLoading, setIsLoading] = React.useState(false);
  React.useEffect(() => {
    AuthUtils.getUserInfo().then((userDetails) => {
      setUser(userDetails);
    });
  }, []);
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
      <ProfilePicture
        name={user.name}
        username={user.username}
        setEditMode={setEditMode}
        editMode={editMode}
      />

      <VStack space={3} alignItems="center" width="90%">
        <Formik
          initialValues={{
            name: user.name,
            email: user.email,
            username: user.username,
          }}
          validationSchema={profileSchema}
          enableReinitialize
          onSubmit={async (values, { setSubmitting, setFieldError }) => {
            setIsLoading(true);
            setUser(values);
            AuthUtils.updateUserInfo(values.name, values.email, values.username)
              .then(() => {
                setIsLoading(false);
                setSubmitting(false);
                setEditMode(false);
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
          }) => (
            <>
              <VStack marginTop={5} width="90%">
                <FormControl isRequired={!editMode} isInvalid={errors.general} alignItems="center">
                  <FormControl
                    isRequired={editMode}
                    isInvalid={errors.username && touched.username}
                  >
                    <FormControl.Label color="red">Name</FormControl.Label>
                    <Input
                      variant="underlined"
                      value={values.name}
                      onChangeText={handleChange('name')}
                      onBlur={handleBlur('name')}
                      isDisabled={!editMode}
                    />
                    <FormControl.ErrorMessage>
                      {errors.name}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl
                    isRequired={editMode}
                    isInvalid={errors.email && touched.email}
                  >
                    <FormControl.Label>Email Address</FormControl.Label>
                    <Input
                      variant="underlined"
                      value={values.email}
                      onChangeText={handleChange('email')}
                      onBlur={handleBlur('email')}
                      isDisabled={!editMode}
                    />
                    <FormControl.ErrorMessage>
                      {errors.email}
                    </FormControl.ErrorMessage>
                  </FormControl>
                  <FormControl.ErrorMessage>
                    {errors.general}
                  </FormControl.ErrorMessage>
                </FormControl>
              </VStack>
              <VStack marginTop="24%" alignItems="center" width="90%">
                {editMode ? (

                  <Button onPress={handleSubmit} w="40%" bg="primary.600">
                    {isFormLoading ? (
                      <ActivityIndicator size="small" color="white" />
                    ) : (
                      <Text>Save</Text>)}
                  </Button>
                ) : (
                  <Button
                    onPress={() => AuthUtils.logout(navigation)}
                    w="40%"
                    bg="error.600"
                    _hover={{ bg: 'error.700' }}
                  >
                    Logout
                  </Button>
                )}
              </VStack>
            </>
          )}
        </Formik>
      </VStack>
    </View>
  );
}

export default ProfileScreen;
