import {
  View,
  ActivityIndicator,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { Text, Button } from 'native-base';
import PlantUtils from '../../api/utils/PlantUtils';

function PlantsScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    PlantUtils.getAuthenticatedUser().then((email) => {
      setUserEmail(email);
    });
  }, []);

  if (userEmail == null) {
    return (
      <ActivityIndicator size="large" color="#00ff00" />
    );
  }
  return (

    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
      }}
    >
      <Text>{userEmail}</Text>
      <Text>PlantsScreen</Text>
      <Button
        title="Plant Details"
        onPress={() => navigation.navigate('PlantDetails', { itemID: 12 })}
      />
    </View>
  );
}

export default PlantsScreen;
