import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const SandBox = () => {
  const [count1, setcount1] = useState(0);
  const [count, setcount] = useState(0);
  const curref = useRef<TextInput>(null);

  return (
    <>
      <View style={{flex: 1}}>
        <TouchableOpacity onPress={() => setcount(1)}>
          <Text>123</Text>
        </TouchableOpacity>
        {count > 0 && (
          <View
            style={{
              flex: 1,
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              position: 'absolute',
              zIndex: 10000,
              backgroundColor: 'black',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TextInput
              ref={curref}
              value="123123123"
              style={{color: 'white'}}
            />
            <Text style={{color: 'white'}}>123</Text>
            <Button title="123" onPress={() => curref.current?.focus()} />
          </View>
        )}
      </View>
    </>
  );
};

export default SandBox;

const styles = StyleSheet.create({});
