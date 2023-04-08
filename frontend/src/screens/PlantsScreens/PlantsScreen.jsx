import {
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import PlantUtils from '../../api/utils/PlantUtils';
import API from '../../api/API';
import CreatePlantForm from '../../components/CreatePlantForm';
import EditPlantForm from '../../components/EditPlantForm';
import {Text,Icon,Select,VStack,HStack,Alert,IconButton,CloseIcon,Modal,Input,Button,FormControl} from 'native-base';
import { MaterialIcons} from '@expo/vector-icons';

function PlantsScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState('');
  const [plants, setPlants] = useState([]);
  const [plantTypes, setPlantsTypes] = useState([]);
  const [devices, setDevices] = useState([]);
  const [plantProfiles, setPlantProfiles] = useState([]);
  const [isViewVisible, setIsViewVisible] = useState(false);
  const [isEditVisible, setIsEditVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedPlantId, setSelectedPlantId] = useState(null);

  const handleButtonClick = () => {
    setIsViewVisible(!isViewVisible);
  };

  const handleEditClick = () => {
    setIsEditVisible(!isEditVisible);
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
          <TouchableOpacity  style={styles.createPlantButton} onPress={() => setShowModal(true)} >
              <Text style={styles.createText}> Create Plant </Text>
          </TouchableOpacity>
        </View>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
          <Modal.Content maxWidth="400px">
          <Modal.CloseButton />
          <Modal.Header>Create Plant</Modal.Header>
          <Modal.Body>
            <CreatePlantForm plantTypes={plantTypes} plantProfiles={plantProfiles} devices={devices}/> 
          </Modal.Body>
          </Modal.Content>
        </Modal>

        <View style={{width:"90%"}}>
          {plants.map((plant) => (
            <>
            <Text style={{fontSize:25,padding: 7}} key={plant.id}>{plant.name}</Text>
            <View style={{borderColor:'grey',borderWidth:3,paddingBottom: 7,paddingLeft: 2,paddingRight: 2,width:"100%",marginBottom:10, borderRadius: 10}}>
                <View style={{flexDirection:'row',flex:1,padding:10}}>
                  <Text style={{fontSize:20,color:'green', flex:3,fontWeight:'bold'}} key={plant.id}>{plant.plant_type.name}</Text>
                  <TouchableOpacity  style={[styles.detailsButton,{fontSize:25,flex:1,flexDirection:'row',justifyContent: 'center',alignItems: 'center'}]} onPress={() => setSelectedPlantId(plant.id)}>
                  {/* <Button onPress={() => setShowModal(true)}>Button</Button> */}
                  <Text style={styles.createText}>Edit  </Text>
                    <Icon as={MaterialIcons} name="edit" color="white" _dark={{color: "white"}} />
                    
                  </TouchableOpacity>

                  {/* To be Changed to handleEdit */}
                  <TouchableOpacity  style={[styles.detailsButton,{fontSize:25,flex:1,flexDirection:'row',justifyContent: 'center',alignItems: 'center'}]} onPress={() => handleDelete(plant.id)}>
                  <Text style={styles.createText}>Delete </Text>
                    <Icon as={MaterialIcons} name="delete" color="white" _dark={{color: "white"}} /> 
                  </TouchableOpacity>
                </View>

                <View style={{justifyContent: 'center',alignItems: 'center',flex:1}} >
                  <TouchableOpacity  style={styles.detailsButton} onPress={() => navigation.navigate('PlantDetails', { itemID: plant.name })}  >
                  <Text style={styles.createText}>Plant Details</Text>
                  
                  </TouchableOpacity>

                </View>
                
                <View>
                    {/* <EditPlantForm plantTypes={plantTypes} plantProfiles={plantProfiles} devices={devices} plantID={plant.id}/>  */}
                  <Modal isOpen={selectedPlantId === plant.id} onClose={() => setSelectedPlantId(null)}>
                    <Modal.Content maxWidth="400px">
                    <Modal.CloseButton />
                    <Modal.Header>Edit Plant</Modal.Header>
                    <Modal.Body>
                      <EditPlantForm plantTypes={plantTypes} plantProfiles={plantProfiles} devices={devices} plant={plant}/>
                    </Modal.Body>
                    </Modal.Content>
                  </Modal>
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
  },
  createText:{
      color:'#fff',
      textAlign:'center',
      justifyContent: 'center',
      alignItems: 'center'
  },
    scrollView: {
      marginHorizontal: 40,
      width:'100%',
      left:-40
    },
    });
    

export default PlantsScreen;
