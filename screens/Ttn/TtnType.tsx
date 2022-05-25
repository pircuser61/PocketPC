import React from 'react';
import {View} from 'react-native';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';

const TtnType = (props: any) => {
  return (
    <ScreenTemplate {...props} title="Выбор ТТН">
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
        }}>
        <SimpleButton
          containerStyle={{marginTop: 20}}
          text="Местные, Исходящие"
          onPress={() => {
            props.navigation.navigate('TtnList');
          }}
        />
        <SimpleButton
          containerStyle={{marginTop: 20}}
          text="Входящие Междугородние"
          active={false}
        />
      </View>
    </ScreenTemplate>
  );
};

export default TtnType;
