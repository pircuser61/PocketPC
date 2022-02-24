import React from 'react';
import {StyleSheet, Text, View, Image, ImageBackground} from 'react-native';
import {SCREEN_HEIGHT, SCREEN_WIDTH} from '../constants/funcrions';

const LoadingScreen = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/launch_screen.png')}
        style={styles.backgroundImage}></ImageBackground>
    </View>
  );
};

export default LoadingScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  backgroundImage: {
    flex: 1,
    resizeMode: 'cover', // or 'stretch',
    justifyContent: 'center',
  },

  loginForm: {
    backgroundColor: 'transparent',
    alignItems: 'center',
  },

  text: {
    fontSize: 30,
    fontWeight: 'bold',
  },
});
