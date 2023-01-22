import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, TouchableOpacity } from "react-native";
import { AuthUtils } from "../../api/utils/AuthUtils";
import { useTheme } from "@react-navigation/native";

export function ForgotPasswordScreen({navigation}) {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Text style={colors.subtitle}> Forgot Password </Text>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
      <TouchableOpacity
      onPress={()=>{
        navigation.goBack()
      }}
      >
      <MaterialCommunityIcons
                name="arrow-left"
                color={'#000'}
                size={26}
              />
      </TouchableOpacity>
        <TextInput
          style={{
            height: 40,
            borderRadius: 10,
            paddingLeft: 5,
            marginBottom: 5,
            borderColor: "#e6e6e6",
            borderWidth: 0.5,
            width: "60%",
          }}
          placeholder="Email"
          onChangeText={(value) => setEmail(value)}
          defaultValue={email}
        />
        <Button
        style={{
          marginTop:10
        }}
          onPress={async () => {
            AuthUtils.login(navigation, email, password);
          }}
          title="Retrive password"
          accessibilityLabel="submit form"
        />
      </View>
      <View
      style={{
        marginTop:50
      }}      
      >
      </View>
    </View>
  );
}
