import { Platform } from 'react-native';
/* eslint-disable no-dupe-keys */
/* eslint-disable import/prefer-default-export */
export const LightTheme = {
  dark: false,
  // do not delete require for react navigtion to load correctly
  colors: {
    primary: '#438707',
    background: 'rgb(255, 255, 255)',
    card: 'rgb(255, 255, 255)',
    text: 'rgb(28, 28, 30)',
    border: 'rgb(255, 255, 255)',
    iconColor: '#7d7f7e',
    // do not delete require for react navigtion to load correctly

    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
    },
    centeredViewWithColumnFlex: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
      width: '100%',
      height: '100%',
      overflow: 'hidden',
    },
    formContainer: {
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',

      ...Platform.select({
        web: {
          maxWidth: 1000,
        },
      }),
    },
    upperTextContainer: {

      ...Platform.select({
        web: {

          maxHeight: '0%',
          paddingBottom: 50,
        },
      }),
    },

    title: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 50,
      fontWeight: 'bold',
      margin: 10,
    },
    subtitle: {
      flexDirection: 'row',
      marginRight: '40%',
      fontSize: 45,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    profileName: {
      fontSize: 45,
      fontWeight: 'bold',
      color: '#000',
    },
    username: {
      fontSize: 25,
      fontWeight: 'bold',
      color: '#438707',
    },
    tagline: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 22,
      fontWeight: 'semi-bold',
      marginLeft: 9,
      color: '#7d7f7e',
    },
    tableTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
    },
    textFormat: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 25,
    },
    textInput: {
      height: 40,
      borderRadius: 10,
      paddingLeft: 5,
      marginBottom: 5,
      borderColor: '#e6e6e6',
      borderWidth: 0.5,
      width: '75%',
      fontSize: 18,
    },
    profilePicMobile: {
      width: 37,
      height: 37,
      marginRight: 7,
      overflow: 'hidden',
      borderRadius: 20,
    },
    profilePicWeb: {
      width: 40,
      height: 40,
      marginRight: 5,
      borderRadius: '50%',
    },
    tableCardView: {
      borderRadius: 20,
      width: '90%',
      height: '50%',
      marginTop: '15%',
      padding: '3%',
      paddingTop: '1%',
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    plantProfileRow: {
      height: '10%',
      minHeight: '10%',
    },
    plantProfileCol: {
      width: '40%',
      minWidth: '40%',
    },
    plantProfileHeadingText: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#000',
      width: '100%',
      minWidth: '100%',
    },
    plantProfileText: {
      fontSize: 18,
      color: '#000',
      width: '100%',
      minWidth: '100%',
    },
  },
};