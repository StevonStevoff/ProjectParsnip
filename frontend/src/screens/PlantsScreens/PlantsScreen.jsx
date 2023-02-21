import {
  Text,
  View,
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
import { Icon} from 'native-base';
import { MaterialIcons} from '@expo/vector-icons';

function PlantsScreen({ navigation }) {
  const { colors } = useTheme();
  const [userEmail, setUserEmail] = useState('');
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantsTypes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [plantProfiles, setPlantProfiles] = useState([]);
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
    const fetchPlantsProfiles = async () => {
      try {
        const response = await API.getAllPlantProfiles();
        setPlantProfiles(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchPlantsProfiles();
  }, []);
  
  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const response = await API.getAllDevices();
        setDevices(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchDevices();
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
        await API.deletePlant(id).then((response) => {
        // fetchPlants();
      });
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
        <View style={{flexDirection:'row'}}>
          <Text style={{paddingTop:20,fontSize:20,fontWeight:'bold'}}>Your Plants</Text>  
          <TouchableOpacity  style={styles.createPlantButton} onPress={() => handleButtonClick()} >
            {isViewVisible ? 
              <Text style={styles.createText} >Close</Text> : 
              <Text style={styles.createText}>Create Plant</Text>
            }
          </TouchableOpacity>
        </View>

        {isViewVisible && (
          <View style={{borderColor:'grey',borderWidth:3,width:"90%",borderRadius: 10,marginTop:10,padding:10}}>
            <CreatePlantForm plantTypes={plantTypes} plantProfiles={plantProfiles} devices={devices}/> 
          </View>
        )}

        <View >
          {plants.map((plant) => (
            <>
            <Text style={{fontSize:25,paddingBottom: 7}} key={plant.id}>{plant.name}</Text>
            <View style={{borderColor:'grey',borderWidth:3,paddingBottom: 7,paddingLeft: 2,paddingRight: 2,width:350,marginBottom:10, borderRadius: 10}}>
                <View style={{flexDirection:'row',flex:1,padding:10}}>
                  <Text style={{fontSize:20,color:'green', flex:10,fontWeight:'bold'}} key={plant.id}>{plant.plant_type.name}</Text>
                  <TouchableOpacity style={{fontSize:25,flex:1}} onPress={() => handleDelete(plant.id)}>
                    <Icon as={MaterialIcons} name="delete" color="coolGray.800" _dark={{color: "warmGray.50"}} />
                  </TouchableOpacity>

                  {/* To be Changed to handleEdit */}
                  <TouchableOpacity style={{fontSize:25,flex:1}} onPress={() => handleDelete(plant.id)}>
                    <Icon as={MaterialIcons} name="edit" color="coolGray.800" _dark={{color: "warmGray.50"}} />
                  </TouchableOpacity>
                </View>

                <View style={{justifyContent: 'center',alignItems: 'center',flex:1}} >
                  <TouchableOpacity  style={styles.detailsButton} onPress={() => navigation.navigate('PlantDetails', { itemID: plant.name })}  >
                  <Text style={styles.createText}>Plant Details</Text>
                  </TouchableOpacity>

                </View>
            </View>
            
            </>   
          ))}
        </View>


    </View>
        
    </ScrollView>
   
  );
}

const styles = StyleSheet.create({
  createPlantButton:{
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
  detailsButton:{
    marginRight:10,
    marginLeft:10,
   marginTop:10,
    paddingTop:10,
    paddingBottom:10,
    backgroundColor:'#1E3438',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#1E6738',
    width:'40%',
  },
  createText:{
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
