import React, { useState, useEffect } from 'react';
import { NativeBaseProvider } from 'native-base';
import { ActivityIndicator } from 'react-native';
import NavigationRoot from './src/navigation/NavigationRoot';
import defaultTheme from './src/stylesheets/defaultTheme';
import API from './src/api/API';
import CheckAPIConnection from './src/components/CheckAPIConnection';

function App() {
  const theme = defaultTheme();
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkConnection = async () => {
    try {
      const response = await API.checkAPIConnection();
      console.log(response);
      const connected = response.status === 200;
      setIsConnected(connected);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setIsConnected(false);
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  if (loading) {
    return <ActivityIndicator />;
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
