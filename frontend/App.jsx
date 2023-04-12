import React from 'react';
import { NativeBaseProvider } from 'native-base';
import NavigationRoot from './src/navigation/NavigationRoot';
import defaultTheme from './src/stylesheets/defaultTheme';

import { enGB, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)


function App() {
  const theme = defaultTheme();
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationRoot />
    </NativeBaseProvider>
  );
}

export default App;
