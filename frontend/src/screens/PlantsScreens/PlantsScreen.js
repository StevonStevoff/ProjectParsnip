import { Text, View, Button } from "react-native";
import React, {useEffect, useState} from "react";
import { useTheme } from "@react-navigation/native";
import { PlantUtils } from "../../api/utils/PlantUtils";

export function PlantsScreen({ navigation }) {
  const { colors } = useTheme();
  const [ userEmail, setUserEmail ] = useState('');

  useEffect(() => {
    PlantUtils.getAuthenticatedUser().then((email) => {
      setUserEmail(email)
    })
  }, [])

  if(userEmail == null){
    return (
      <ActivityIndicator size="large" color="#00ff00" />
    )
  }else{
    return (
    
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          color: '#fff'
        }}
      >
        <Text style={colors.textFormat}>{userEmail}</Text>
        <Text style={colors.textFormat}>PlantsScreen</Text>
        <Button
          title="Plant Details"
          onPress={() => navigation.navigate("PlantDetails", { itemID: 12 })}
        />
      </View>
    );
  }
}
