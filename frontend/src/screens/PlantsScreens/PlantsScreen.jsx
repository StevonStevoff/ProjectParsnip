import {
  Text,
  View,
  Button,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useTheme } from '@react-navigation/native';
import PlantUtils from '../../api/utils/PlantUtils';
import API from '../../api/API';
import CreatePlantForm from '../../components/CreatePlantForm';
import {Icon} from 'native-base';
import { MaterialIcons} from '@expo/vector-icons';
import { LogBox } from 'react-native';

// Added this because I was getting annoying errors when using fake data
LogBox.ignoreLogs(['Encountered two children with the same key']);

function PlantsScreen({ navigation }) {
  const { colors } = useTheme();
  const [userEmail, setUserEmail] = useState('');
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantsTypes] = useState([]);
  const [isViewVisible, setIsViewVisible] = useState(false);


  const handleButtonClick = () => {
    setIsViewVisible(!isViewVisible);
  };

  useEffect(() => {
    PlantUtils.getAuthenticatedUser().then((email) => {
      setUserEmail(email);
    });
  }, []);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        const response = await API.getCurrentUsersPlants();
        setPlants(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlants();
  }, []);

  useEffect(() => {
    const fetchPlantsTypes = async () => {
      try {
        const response = await API.getAllPlantTypes();
        setPlantsTypes(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlantsTypes();
  }, []);
 
  useEffect(() => {
    setIsViewVisible(false);
  }, []);

  if (userEmail == null) {
    return (
      <ActivityIndicator size="large" color="#00ff00" />
    );
  }

  const handleDelete = async (id) => {
    try {
      const response = await API.deletePlant(id);
    } catch (error) {
    }
  };

  return (
    <ScrollView style={styles.scrollView}>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff'
          
        }}
      >
        <Text style={colors.textFormat}>{userEmail}</Text>
        <Text style={colors.textFormat}>PlantsScreen
          <Button  style={{top:10}} title={isViewVisible ? 'Close' : 'Create Plant'} onPress={handleButtonClick} />
        </Text>  
        {isViewVisible && (
          <CreatePlantForm/> 
        )}

        <View >
          {plants.map((plant) => (
            <>
            <View style={{borderColor:'black',borderWidth:3,padding: 10,width:300,marginBottom:10, borderRadius: 10}}>
                <Text style={{fontSize:25}} key={plant.id}>{plant.name}</Text>
                <TouchableOpacity onPress={() => handleDelete(plant.id)}>
                  <Icon as={MaterialIcons} name="delete" color="coolGray.800" _dark={{color: "warmGray.50"}} />
                </TouchableOpacity>

                {/* To be Change to handleEdit */}
                <TouchableOpacity onPress={() => handleDelete(plant.id)}>
                  <Icon as={MaterialIcons} name="edit" color="coolGray.800" _dark={{color: "warmGray.50"}} />
                </TouchableOpacity>
                  <Text style={{fontSize:20,color:'green'}} key={plant.id}>{plant.plant_type.name}</Text>
                  
                <Button title="Plant Details" onPress={() => navigation.navigate('PlantDetails', { itemID: plant.name })} />
            </View>
            </>   
          ))}
        </View>

        <View >
          {plantTypes.map((type) => (
            <>
              <View style={{borderColor:'black',borderWidth:3,padding: 10,width:300,marginBottom:10, borderRadius: 10}}>
                <Text style={{fontSize:20,color:'green'}} key={type.id}>{type.name}</Text>
              </View>
            </>   
          ))}
        </View>

    </View>

    </ScrollView>
   
  );
}

const styles = StyleSheet.create({
    scrollView: {
      marginHorizontal: 40,
      width:'100%',
      left:-40
    },
    });
    

export default PlantsScreen;
