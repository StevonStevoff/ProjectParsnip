import React from 'react';
import { NativeBaseProvider } from 'native-base';
import NavigationRoot from './src/navigation/NavigationRoot';
import defaultTheme from './src/stylesheets/defaultTheme';

function App() {
  const theme = defaultTheme();
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationRoot />
    </NativeBaseProvider>
  );
}

export default App;
