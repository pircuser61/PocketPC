import {MotiView} from '@motify/components';
import React, {useState} from 'react';
import {Button, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import MenuListComponent from '../SystemComponents/MenuListComponent';

const DropDownMenu = () => {
  const [open, setopen] = useState(false);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setopen(!open);
        }}>
        <Text>Изменить кол-во</Text>
      </TouchableOpacity>
      {open && (
        <MotiView
          from={{opacity: 0}}
          animate={{opacity: 1}}
          style={{
            width: 200,
            padding: 16,

            backgroundColor: 'red',
            position: 'absolute',
            zIndex: 100,
            transform: [{translateY: -100}],
          }}>
          <MenuListComponent
            data={[
              {action: () => {}, title: '+'},
              {action: () => {}, title: '-'},
              {action: () => {}, title: 'Изменить кол-во'},
            ]}
          />
        </MotiView>
      )}
    </View>
  );
};

export default DropDownMenu;

const styles = StyleSheet.create({});
