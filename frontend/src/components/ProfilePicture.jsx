import { View, Text, Image } from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';

function ProfilePicture({ name, username }) {
  const { colors } = useTheme();
  return (
    <View
      style={{
        width: '70%',
        height: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
      }}
    >
      <Image
        source={require('../../assets/templateProfilePic.png')}
        style={{
          width: '100%',
          height: '100%',
          resizeMode: 'contain',
        }}
      />
      <Text style={colors.profileName}>{name}</Text>
      <Text style={colors.username}>{username}</Text>
    </View>
  );
}

export default ProfilePicture;
