import React, { useState } from 'react';
import {
  View, TextInput, TouchableOpacity,
} from 'react-native';
import { Text, Button } from 'native-base';

function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState('');
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <Text> Forgot Password </Text>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text>Go Back</Text>
        </TouchableOpacity>
        <TextInput
          style={{
            height: 40,
            borderRadius: 10,
            paddingLeft: 5,
            marginBottom: 5,
            borderColor: '#e6e6e6',
            borderWidth: 0.5,
            width: '60%',
          }}
          placeholder="Email"
          onChangeText={(value) => setEmail(value)}
          defaultValue={email}
        />
        <Button
          style={{
            marginTop: 10,
          }}
          onPress={async () => {
            // AuthUtils.login(navigation, email, password);
          }}
          title="Retrive password"
          accessibilityLabel="submit form"
        />
      </View>
      <View
        style={{
          marginTop: 50,
        }}
      />
    </View>
  );
}

export default ForgotPasswordScreen;
