import { en, registerTranslation } from 'react-native-paper-dates';
import React, { useState, useEffect } from 'react';
import { NativeBaseProvider, Center } from 'native-base';
import { ActivityIndicator } from 'react-native';
import NavigationRoot from './src/navigation/NavigationRoot';
import defaultTheme from './src/stylesheets/defaultTheme';
import API from './src/api/API';
import CheckAPIConnection from './src/components/CheckAPIConnection';

registerTranslation('en', en);

function App() {
  const theme = defaultTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkConnection = async () => {
    try {
      const response = await API.checkAPIConnection();
      const connected = response.status === 200;
      setIsConnected(connected);
      setLoading(false);
    } catch (error) {
      setIsConnected(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (loading) {
    return (
      <NativeBaseProvider theme={theme}>
        <Center flex={1}>
          <ActivityIndicator size="large" color="#4da707" />
        </Center>
      </NativeBaseProvider>
    );
  }

  if (!isConnected) {
    return (
      <NativeBaseProvider theme={theme}>
        <CheckAPIConnection onRetry={checkConnection} />
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider theme={theme}>
      <NavigationRoot />
    </NativeBaseProvider>
  );
}

export default App;
