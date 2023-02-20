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
import { Row } from 'antd';

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
        <View style={{flexDirection:'row',flex:1}}>
          <Text style={{paddingTop:20,fontSize:20,fontWeight:'bold'}}>Your Plants</Text>  
          <TouchableOpacity  style={styles.loginScreenButton} onPress={() => handleButtonClick()} >
            {isViewVisible ? 
              <Text style={styles.loginText} >Close</Text> : 
              <Text style={styles.loginText}>Create Plant</Text>
            }
          </TouchableOpacity>
        </View>

        {isViewVisible && (
          <CreatePlantForm/> 
        )}

        <View >
          {plants.map((plant) => (
            <>
            <Text style={{fontSize:25,paddingBottom: 7}} key={plant.id}>{plant.name}</Text>
            <View style={{borderColor:'grey',borderWidth:3,paddingBottom: 7,paddingLeft: 2,paddingRight: 2,width:350,marginBottom:10, borderRadius: 10}}>
                <View style={{flexDirection:'row',flex:1,padding:10}}>
                  <Text style={{fontSize:20,color:'green', flex:10}} key={plant.id}>{plant.plant_type.name}</Text>
                  <TouchableOpacity style={{fontSize:25,flex:1}} onPress={() => handleDelete(plant.id)}>
                    <Icon as={MaterialIcons} name="delete" color="coolGray.800" _dark={{color: "warmGray.50"}} />
                  </TouchableOpacity>

                  {/* To be Changed to handleEdit */}
                  <TouchableOpacity style={{fontSize:25,flex:1}} onPress={() => handleDelete(plant.id)}>
                    <Icon as={MaterialIcons} name="edit" color="coolGray.800" _dark={{color: "warmGray.50"}} />
                  </TouchableOpacity>
                </View>

                <View >
                  <Button title="Plant Details" onPress={() => navigation.navigate('PlantDetails', { itemID: plant.name })} />
                </View>
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
  loginScreenButton:{
    marginRight:10,
    marginLeft:120,
   marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#1E6738',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  loginText:{
      color:'#fff',
      textAlign:'center',
      paddingLeft : 10,
      paddingRight : 10
  },
    scrollView: {
      marginHorizontal: 40,
      width:'100%',
      left:-40
    },
    });
    

export default PlantsScreen;
