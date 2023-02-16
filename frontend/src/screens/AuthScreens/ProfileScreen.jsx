import {
  Text,
  View,
  Image,
} from 'react-native';
import React from 'react';
import { useTheme } from '@react-navigation/native';
import UsersPlantProfilesTable from '../../components/UsersPlantProfilesTable';

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
        overflow: 'hidden',
      }}
    >
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
          source={require('../../../assets/templateProfilePic.png')}
          style={{
            width: '100%',
            height: '100%',
            resizeMode: 'contain',
          }}
        />
        <Text style={colors.profileName}>Jane Doe</Text>
        <Text style={colors.username}>@JDoe</Text>
      </View>
      <View
        style={colors.tableCardView}
      >
        <UsersPlantProfilesTable />
      </View>
    </View>
  );
}

export default ProfileScreen;
