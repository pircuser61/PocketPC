import React from 'react';
import {View} from 'react-native';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';

const TtnWorkMode = (props: any) => {
  return (
    <ScreenTemplate {...props} title={'Режим работы '}>
      <View
        style={{
          marginLeft: 10,
          marginRight: 10,
        }}>
        <SimpleButton
          containerStyle={{marginTop: 20}}
          text="Просмотр ТТН"
          onPress={() => {
            props.navigation.navigate('TtnPaletts', {
              ...props.route.params,
              workMode: 'View',
            });
          }}
        />

        <SimpleButton
          containerStyle={{marginTop: 20}}
          text="Редакт-ние списка палетт"
          onPress={() => {
            props.navigation.navigate('TtnPaletts', {
              ...props.route.params,
              workMode: 'Edit',
            });
          }}
        />
        <SimpleButton
          containerStyle={{marginTop: 20}}
          text="Проверка наличия палетт"
          onPress={() => {
            props.navigation.navigate('TtnPaletts', {
              ...props.route.params,
              workMode: 'Check',
            });
          }}
        />
      </View>
    </ScreenTemplate>
  );
};

export default TtnWorkMode;
