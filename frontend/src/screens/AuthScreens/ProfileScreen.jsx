import {
  Text,
  View,
  TouchableOpacity,
  Button,
  Image,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '@react-navigation/native';
import AuthUtils from '../../api/utils/AuthUtils';

function ProfileScreen({ navigation }) {
  const { colors } = useTheme();
  // const { user } = AuthUtils.getCurrentUser();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
      }}
    >
      <View style={{ width: '70%', height: '20%', marginTop: '1%' }}>
        <Image
          source={require('../../../assets/templateProfilePic.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
      </View>
      <View style={colors.centeredView}>
        <Text style={colors.subtitle}>Jane Doe</Text>
      </View>
    </View>
  );
}

export default ProfileScreen;
