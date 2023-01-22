import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@react-navigation/native';
import AuthUtils from '../../api/utils/AuthUtils';

function RegistrationScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  return (
    <View
      style={colors.centeredView}
    >
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
        <Text style={colors.subtitle}>Create Account </Text>
      </View>
      <View
        style={{
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}
      >
        <TextInput
          style={colors.textInput}
          placeholder="Email"
          onChangeText={(value) => setEmail(value)}
          defaultValue={email}
        />
        <TextInput
          style={colors.textInput}
          placeholder="Password"
          onChangeText={(value) => setPassword(value)}
          defaultValue={password}
        />
        <Text style={{ color: 'white' }}>{error}</Text>
        <View style={{ width: '70%', marginTop: 20, height: 50 }}>
          <LinearGradient
            style={colors.loginBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 0.5 }}
            colors={['#B5EB89', '#529122']}
          >
            <TouchableOpacity
              style={colors.loginBtn}
              onPress={async () => {
                AuthUtils.registerUser(navigation, email, password).then((message) => {
                  setError(message);
                });
              }}
            >
              <Text
                style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}
              >
                Sign Up →
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

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
  );
}

export default RegistrationScreen;
