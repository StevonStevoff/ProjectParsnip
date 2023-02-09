import { Platform } from 'react-native';

/* eslint-disable no-dupe-keys */
// eslint-disable-next-line import/prefer-default-export
export const DarkTheme = {
  
  dark: false,
  background: '#1c1e21',
  // do not delete require for react navigtion to load correctly
  colors: {
    primary: '#58ad0c', // bae3cc
    background: '#1c1e21',
    card: '#1a1c1e',
    text: '#efeef0',
    border: '#1a1c1e',
    iconColor: '#fff',
    // do not delete require for react navigtion to load correctly

    centeredView: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',  
    },
    formContainer:{
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        
        ...Platform.select({
          web: {
            maxWidth:1000, 
          }
        }) 
    },
    upperTextContainer:{     
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
        width: '71%',
        maxHeight:'20%',

        ...Platform.select({
          web: {

            maxHeight:'0%',
            paddingBottom:50,
          }
        })
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
        }
      }) 
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
    loginBtn: {
      borderRadius: 5,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: '#272b31',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        web: {
          minWidth: '100%',
        }
      }) 
    },
    signupBtn: {
      borderRadius: 5,
      borderColor: '#B5EB89',
      borderRadius: 10,
      borderWidth: 1,
      minWidth: '100%',
      height: '100%',
      alignItems: 'center',
      justifyContent: 'center',
      ...Platform.select({
        web: {
          minWidth: '0%',
          width:'100%',
        }
      }) 
    },
  },
};
