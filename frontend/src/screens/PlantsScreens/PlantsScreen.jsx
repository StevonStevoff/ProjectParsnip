import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import {Text,Icon, Heading} from 'native-base';
import { MaterialIcons} from '@expo/vector-icons';
import PlantUtils from '../../api/utils/PlantUtils';
import API from '../../api/API';

function PlantsScreen({ navigation }) {

  const [userEmail, setUserEmail] = useState('');
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantsTypes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [plantProfiles, setPlantProfiles] = useState([]);

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
      } catch (error) { /* empty */ }
    };
    fetchPlants();
  }, []);

  useEffect(() => {
    const fetchPlantsTypes = async () => {
      try {
        const response = await API.getAllPlantTypes();
        setPlantsTypes(response.data);
      } catch (error) { /* empty */ }
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
      } catch (error) { /* empty */ }
    };
    fetchDevices();
  }, []);

  if (userEmail == null) {
    return (
      <ActivityIndicator size="large" color="#00ff00" />
    );
  }

  const handleDelete = async (id) => {
    try {
        await API.deletePlant(id).then(() => {
        // fetchPlants();
      });
    } catch (error) { /* empty */ }
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
          <Heading >Your Plants</Heading>  
          <TouchableOpacity   style={styles.createPlantButton} 
             onPress={() => navigation.navigate('RegisterPlantScreen',{plantTypes:plantTypes, plantProfiles:plantProfiles, devices:devices})} >
             <Text style={styles.createText}> Create Plant </Text>
          </TouchableOpacity>
        </View>

        <View style={{width:"90%"}}>
          {plants.map((plant) => (
            <>
              <Text style={{fontSize:25,padding: 7}} key={plant.id}>{plant.name}</Text>
              <View style={styles.plantContainer}>
              
                <View style={{flexDirection:'row',padding:10,height:100}}>
                    <Text style={{fontSize:20,color:'green', flex:3,fontWeight:'bold'}} key={plant.id}>{plant.plant_type.name}</Text>
                    <TouchableOpacity  style={styles.detailsButton} 
                      onPress={() => navigation.navigate('EditPlantScreen',{plantTypes:plantTypes, plantProfiles:plantProfiles, devices:devices ,plant:plant})}
                    >
                      <Text style={styles.createText}>Edit  </Text>
                      <Icon as={MaterialIcons} name="edit" color="white" _dark={{color: "white"}} />  
                    </TouchableOpacity>
                    {/* To be Changed to handleEdit */}
                    <TouchableOpacity  style={styles.detailsButton} onPress={() => handleDelete(plant.id)}>
                      <Text style={styles.createText}>Delete </Text>
                      <Icon as={MaterialIcons} name="delete" color="white" _dark={{color: "white"}} /> 
                    </TouchableOpacity>
                </View>

                  
                {plant.outdoor ? <Text style={styles.plantContainerText} >Outdoor</Text>:
                  <Text style={styles.plantContainerText} >Indoor</Text> 
                }

                {plant.time_planted===null ? <Text style={styles.plantContainerText} >Time planted: Not set</Text>:
                  <Text style={styles.plantContainerText} >Time planted:{new Date(plant.time_planted).toLocaleDateString()}</Text>
                }
                    
                <View style={{justifyContent: 'center',alignItems: 'center',flex:1}} >
                  <TouchableOpacity  style={styles.detailsButton} onPress={() => navigation.navigate('PlantDetails')}  >
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
    paddingRight:15,
    paddingLeft:15,
    backgroundColor:'#1E6738',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#fff'
  },
  plantContainer:{
    borderColor:'grey',
    borderWidth:3,
    paddingBottom: 15,
    paddingLeft: 2,
    paddingRight: 2,
    width:"100%",
    marginBottom:10, 
    borderRadius: 10
  },
  detailsButton:{
    marginRight:5,
    marginLeft:5,
    paddingTop:10,
    paddingBottom:10,
    paddingRight:10,
    paddingLeft:10,
    backgroundColor:'#1E3438',
    borderRadius:10,
    borderWidth: 1,
    borderColor: '#1E6738',
    width:'40%',
    fontSize:25,
    flex:1,
    flexDirection:'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  createText:{
    color:'#fff',
    textAlign:'center',
    justifyContent: 'center',
    alignItems: 'center'
  },
  plantContainerText:{
    fontSize:20,
    fontWeight:'bold'
  },
  scrollView: {
    marginHorizontal: 40,
    width:'100%',
    left:-40
  },
    });
    

export default PlantsScreen;
