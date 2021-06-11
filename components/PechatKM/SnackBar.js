import * as React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';

const Snack = ({visible,setVisible,error,setError}) => {

  return (
    
      <Snackbar
        visible={visible}
        style={{backgroundColor:error.color||'white'}}
        onDismiss={()=>{
            visible?setVisible(false):setVisible(true)
            setError(false)
        }}
        action={{
          label: 'ОК',
          onPress: () => {
            setVisible(false)
            setError(false)
          },
          
        }}>
        <Text style={{color:error.fontColor||'black'}}>{error.text?error.text:null}</Text>
      </Snackbar>
  
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
});

export default Snack;