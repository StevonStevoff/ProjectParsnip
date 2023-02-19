import { Platform } from 'react-native';

/* eslint-disable no-dupe-keys */
// eslint-disable-next-line import/prefer-default-export
export const DarkTheme = {

  dark: true,
  background: '#1c1e21',
  // do not delete require for react navigtion to load correctly
  colors: {
    primary: '#58ad0c', // bae3cc
    background: '#1c1e21',
    card: '#1a1c1e',
    text: '#efeef0',
    border: '#1a1c1e',
    iconColor: '#fff',
    dark: true,
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
      flex: 1,
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '80%',
      maxHeight: '20%',

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
      color: '#fff',
    },
    profileName: {
      fontSize: 45,
      fontWeight: 'bold',
      color: '#fff',
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
    textFormat: {
      color: '#efeef0',
      flexDirection: 'row',
      justifyContent: 'space-between',
      fontSize: 25,
    },
    textInput: {
      height: 40,
      borderRadius: 10,
      paddingLeft: 5,
      marginBottom: 5,
      borderColor: '#272b31',
      borderWidth: 0.5,
      width: 5000,
      backgroundColor: '#272b31',
      color: '#efeef0',
      fontSize: 18,
      ...Platform.select({
        web: {
          width: '70%',
        },
      }),
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
    blobImage: {
      flexDirection: 'row-reverse',
      height: '65%',
      width: '65%',
      resizeMode: 'contain',
      transform: [{ rotate: '-30deg' }],
      position: 'absolute',
      top: -230,
      right: 100,
    },

    tableCardView: {
      borderRadius: 20,
      width: '90%',
      height: '50%',
      marginTop: '15%',
      padding: '3%',
      paddingTop: '1%',
      borderRadius: 15,
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
      color: '#fff',
      width: '100%',
      minWidth: '100%',
    },
    plantProfileText: {
      fontSize: 18,
      color: '#fff',
      width: '100%',
      minWidth: '100%',
    },
  },
};