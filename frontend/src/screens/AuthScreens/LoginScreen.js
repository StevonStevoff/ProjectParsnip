import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { AuthUtils } from "../../api/utils/AuthUtils";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from '@react-navigation/native';

export function LoginScreen({ navigation }) {
  const { colors } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setEmail('')
    setPassword('')
    setError('')
  }, [])

  return (
    <View
      style={colors.centeredView}
    >
      <Image
        source={require("../../../assets/backgroundBlob.png")}
        style={colors.blobImage}
      />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "flex-start",
          width: "80%",
          maxHeight: "15%",
        }}
      >
        <Text style={colors.subtitle}> Login</Text>
        <Text style={colors.tagline}> Please sign in to continue </Text>
      </View>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
        }}
      >
        <TextInput
          style={colors.textInput}
          placeholder="Email"
          onChangeText={(value) => setEmail(value)}
          defaultValue={email}
        />
        <TextInput
          style={colors.textInput}
          placeholder="Password"
          onChangeText={(value) => setPassword(value)}
          defaultValue={password}
        />
        <View
          style={{
            flexDirection: "row-reverse",
            alignItems: "flex-end",
            width: "75%",
            marginTop: 9,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("ForgotPassword");
            }}
          >
            <Text
              style={{
                color: "#4a8022",
                fontWeight: "semi-bold",
                fontSize: 15,
              }}
            >
              Forgot Password?
            </Text>
          </TouchableOpacity>
        </View>
        <Text style={{ color: "red" }}>{error}</Text>
        <View style={{ width: "70%", marginTop: 20, height: 50 }}>
          <LinearGradient
            style={colors.loginBtn}
            start={{ x: 0, y: 0 }}
            end={{ x: 0.5, y: 0.5 }}
            colors={["#B5EB89", "#529122"]}
          >
            <TouchableOpacity
              style={colors.loginBtn}
              onPress={async () => {
                AuthUtils.login(navigation, email, password).then(
                  (response) => {
                    setError(response);
                  }
                );
              }}
            >
              <Text
                style={{ color: "white", fontSize: 20, fontWeight: "bold" }}
              >
                Login →
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>

      <View
        style={{
          width: "70%",
          marginTop: 20,
          height: 50,
        }}
      >
        <TouchableOpacity
          style={colors.signupBtn}
          onPress={() => {
            navigation.navigate("Registration");
          }}
        >
          <Text style={{ color: "#529122", fontSize: 20, fontWeight: "bold" }}>
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
