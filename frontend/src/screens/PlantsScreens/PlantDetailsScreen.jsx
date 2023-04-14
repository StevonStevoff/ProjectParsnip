import { View ,Appearance,TouchableOpacity,StyleSheet} from 'react-native';
import { Text } from 'native-base';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { DatePickerModal  } from 'react-native-paper-dates';
import { theme,darkTheme } from '../../stylesheets/paperTheme';

function PlantDetailsScreen() {
  const colorScheme = Appearance.getColorScheme();
  const [range, setRange] = React.useState({ startDate: new Date(), endDate: new Date() });
  const [open, setOpen] = React.useState(false);

  const onDismiss = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  const onConfirm = React.useCallback(
    ({ startDate, endDate }) => {
      setOpen(false);
      setRange({ startDate, endDate });
    },
    [setOpen, setRange]
  );
  console.log(range.startDate);
  console.log(range.endDate);
  return (
    <View style={{}}>
      <Text >PlantProfileScreen</Text>
      {/* <Text >{route.params.itemID}</Text> */}

      <Text >{range.startDate.toLocaleString()}</Text>
    <Text >{range.endDate.toLocaleString()}</Text>
   
      {/* <SafeAreaProvider> */}
        <View style={{justifyContent: 'center', alignItems: 'center', width:"100%",height:"100%"}}>



          <TouchableOpacity  style={[styles.detailsButton,{fontSize:25,flex:1,flexDirection:'row',justifyContent: 'center',alignItems: 'center'}]} onPress={() =>setOpen(true)}>
           <Text style={styles.createText}>Pick range </Text>
            </TouchableOpacity>
          <PaperProvider theme={colorScheme==='dark'? darkTheme:theme} darkTheme={darkTheme} >
          <DatePickerModal
            locale="en-GB"
            mode="range"
            visible={open}
            onDismiss={onDismiss}
            startDate={range.startDate}
            endDate={range.endDate}
            onConfirm={onConfirm}
          />
          </PaperProvider>
        </View>
      {/* </SafeAreaProvider> */}
      

  
    </View>

    
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
    borderRadius:15,
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

export default PlantDetailsScreen;
