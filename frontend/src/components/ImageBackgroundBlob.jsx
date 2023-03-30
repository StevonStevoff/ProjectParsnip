/* eslint-disable global-require */
import { Image, StyleSheet, Platform } from 'react-native';
import React from 'react';

const ImageStyles = StyleSheet.create({
  image: {
    flexDirection: 'row-reverse',
    height: '70%',
    width: '85%',
    resizeMode: 'contain',
    transform: [{ rotate: '-10deg' }],
    position: 'absolute',
    top: -310,
    right: -105,
    ...Platform.select({
      web: {
        height: '65%',
        width: '65%',
      },
    }),
  },
});

function ImageBackgroundBlob() {
  return (
    <Image
      source={require('../../assets/backgroundBlob.png')}
      style={ImageStyles.image}
    />
  );
}

export default ImageBackgroundBlob;
