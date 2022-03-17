import {observer} from 'mobx-react-lite';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import {GlobalCheckNavProps} from '../../types/types';

export type DocumentCheckScreenProps = NativeStackScreenProps<
  GlobalCheckNavProps,
  'DocumentCheckScreen'
>;

const GoodsScreen = observer((props: DocumentCheckScreenProps) => {
  const {item} = props.route.params;

  return (
    <ScreenTemplate
      {...props}
      title={
        CheckPalletsStore.Title.thirdScreen + ' №' + item.NumDoc
      }></ScreenTemplate>
  );
});

export default GoodsScreen;

const styles = StyleSheet.create({});
