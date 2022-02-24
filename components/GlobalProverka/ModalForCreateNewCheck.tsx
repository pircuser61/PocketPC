import {observer} from 'mobx-react-lite';
import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  StyleSheetProperties,
} from 'react-native';
import {
  alertActions,
  MAIN_COLOR,
  TOGGLE_SCANNING,
} from '../../constants/funcrions';
import {PocketProvCreate} from '../../functions/PocketProvCreate';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';
import {CustomModalProps} from '../../types/types';
import ModalTemplate from '../ModalTemplate';
import InputField from '../Perepalechivanie/InputField';

const ModalForCreateNewCheck = observer((props: CustomModalProps) => {
  const [podrazd, setPodrazd] = useState<string>('0');
  const [comment, setComment] = useState<string>('');
  const [otdel, setOtdel] = useState<string>('0');
  async function createNewCheck() {
    try {
      CheckPalletsStore.loading_list = true;
      const response = await PocketProvCreate({
        City: UserStore.user?.['city.cod'],
        CodDep: otdel,
        Comment: comment,
        Type: CheckPalletsStore.Type,
      });
      console.log(response);
    } catch (error) {
      console.log(error);
    } finally {
      CheckPalletsStore.loading_list = false;
    }
  }

  return (
    <ModalTemplate {...props}>
      <View style={{backgroundColor: 'white', borderRadius: 8}}>
        <View style={{padding: 16, backgroundColor: MAIN_COLOR}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <TICustom
              min={true}
              onChangeText={setPodrazd}
              value={podrazd}
              title={'Подр.'}
            />

            <TICustom
              onChangeText={setOtdel}
              value={otdel}
              title={'Отдел'}
              min={true}
            />
          </View>
          <View style={{height: 16}} />
          <TICustom
            onChangeText={setComment}
            value={comment}
            title={'Комментарий'}
          />
        </View>
        <View style={{padding: 16}}>
          <TouchableOpacity
            onPress={createNewCheck}
            style={{
              backgroundColor: MAIN_COLOR,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}>
            <Text
              style={{
                color: 'white',
                padding: 16,
                fontWeight: 'bold',
              }}>
              Создать
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              props.setmodalVisible(false);
            }}
            style={{
              backgroundColor: 'white',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 8,
            }}>
            <Text style={{color: 'black', padding: 16, fontWeight: 'bold'}}>
              Закрыть
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ModalTemplate>
  );
});

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderWidth: 1,
    width: 80,
  },
});
export default ModalForCreateNewCheck;

export const TICustom = (props: {
  onChangeText: (txt: string) => void;
  min?: boolean;
  value: string;
  style?: {};
  title?: string;
  placeholder?: string;
}) => {
  return (
    <View
      style={{
        //backgroundColor: 'white',
        justifyContent: 'center',
      }}>
      <Text style={{fontWeight: 'bold', color: 'white'}}>{props.title}:</Text>
      <TextInput
        onFocus={() => {
          if (props.value === '0' || !props.value) {
            props.onChangeText('');
          }
        }}
        onBlur={() => {
          if ((props.value === '0' || !props.value) && props.min) {
            props.onChangeText('0');
          }
        }}
        maxLength={props.min ? 10 : 100}
        style={{
          backgroundColor: 'white',
          height: props.min ? 50 : 80,
          borderRadius: 4,
          borderWidth: 1,
          width: props.min ? 100 : 220,
          textAlignVertical: props.min ? 'center' : 'top',
        }}
        {...props}
        numberOfLines={props.min ? 1 : 3}
        multiline={props.min ? false : true}
        blurOnSubmit={props.min ? false : true}
      />
    </View>
  );
};

/**
 *  <InputField
          title={'Подразделение'}
          placeholder={'Введите код магазина'}
          iconName={'close'}
          onIconPress={() => setPodrazd('')}
          value={podrazd}
          titleColor={'white'}
          setValue={(txt: string) => setPodrazd(txt)}
          onChangeText={() => {}}
          isTextInput={true}
        />
        <InputField
          title={'Отдел'}
          placeholder={'Введите код магазина'}
          iconName={'close'}
          value={comment}
          titleColor={'white'}
          setValue={(txt: string) => setPodrazd(txt)}
          onChangeText={() => {}}
          isTextInput={true}
        />
        <InputField
          title={'Комментарий'}
          placeholder={'Введите код магазина'}
          iconName={'close'}
          value={otdel}
          titleColor={'white'}
          setValue={(txt: string) => setPodrazd(txt)}
          onChangeText={() => {}}
          isTextInput={true}
        />
 */
