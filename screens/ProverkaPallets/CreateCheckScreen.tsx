import {observer} from 'mobx-react-lite';
import React, {useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  Touchable,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import TitleAndDiscribe from '../../components/GlobalProverka/TitleAndDiscribe';
import InputField from '../../components/Perepalechivanie/InputField';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';
import LoadingTextModal from '../../components/SystemComponents/LoadingTextModal';
import MenuListComponent from '../../components/SystemComponents/MenuListComponent';
import PressBotBar from '../../components/SystemComponents/PressBotBar';
import {
  alertActions,
  BRIGHT_GREY,
  MAIN_COLOR,
  SCREEN_HEIGHT,
  SCREEN_WIDTH,
  timeout,
} from '../../constants/funcrions';
import {PocketProvCreate} from '../../functions/PocketProvCreate';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';

const CreateCheckScreen = observer((props: any) => {
  const [podrazd, setPodrazd] = useState<string>(UserStore.podrazd.Id ?? '0');
  const [comment, setComment] = useState<string>('');
  const [otdel, setOtdel] = useState<string>('0');
  const [loading, setLoading] = useState<boolean>(false);
  const _podrRef1 = useRef(null);
  const _podrRef2 = useRef(null);
  const _podrRef3 = useRef(null);

  async function createNewCheck() {
    try {
      setLoading(true);

      const response = await PocketProvCreate({
        City: UserStore.user?.['city.cod'],
        CodDep: otdel,
        Comment: comment,
        Type: CheckPalletsStore.Type,
        CodShop: podrazd,
        UID: UserStore.user?.UserUID,
        CodObTo: otdel,
      });
      setLoading(false);
      props.navigation.goBack();
      props.route?.params.action(response);
      await timeout(150);
      props.navigation.navigate('WorkWithCheck', {item: {ID: response}});
    } catch (error) {
      setLoading(false);
      alertActions(error);
    }
  }

  const createNewCheckWorkLet = () => {
    'worklet';
    createNewCheck();
  };

  //props.route?.params.title
  return (
    <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
      <View style={{flex: 1}}>
        <ScrollView style={{flex: 1}}>
          <HeaderPriemka {...props} arrow={true} title={'Создание проверки'} />
          <View style={{padding: 16}}>
            <TitleAndDiscribe
              title={'Раздел'}
              discribe={props.route?.params.title}
            />
            <View style={{height: 16}} />

            {CheckPalletsStore.Type === '7' ? (
              <TICustom
                onChangeText={setOtdel}
                width={'100%'}
                value={otdel}
                title={'Объединение-получатель'}
                min={true}
              />
            ) : (
              <View
                style={{
                  //padding: 16,
                  //backgroundColor: MAIN_COLOR,
                  borderRadius: 8,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    width: SCREEN_WIDTH * 0.7,
                    //alignSelf: 'center',
                  }}>
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
                <View style={{}}>
                  <TICustom
                    onChangeText={setComment}
                    value={comment}
                    title={'Комментарий'}
                  />
                </View>
              </View>
            )}
            <View style={{height: 16}} />
          </View>
        </ScrollView>
        <PressBotBar title={'Создать'} onPress={createNewCheckWorkLet} />
        <LoadingTextModal modalVisible={loading} />
      </View>
    </TouchableWithoutFeedback>
  );
});

export default CreateCheckScreen;

const styles = StyleSheet.create({});

export const TICustom = (props: {
  onChangeText: (txt: string) => void;
  min?: boolean;
  value: string;
  style?: {};
  title?: string;
  placeholder?: string;
  width?: number | string;
}) => {
  return (
    <View
      style={{
        //backgroundColor: 'white',
        justifyContent: 'center',
      }}>
      <Text style={{fontWeight: 'bold', color: 'black'}}>{props.title}:</Text>
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
        placeholder={props.title + '...'}
        maxLength={props.min ? 10 : 100}
        style={{
          backgroundColor: 'white',
          height: props.min ? 60 : 80,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: BRIGHT_GREY,
          paddingHorizontal: 8,
          width: props.width
            ? props.width
            : props.min
            ? SCREEN_WIDTH * 0.3
            : SCREEN_WIDTH * 0.9,
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

/** <InputField
            onSubmit={() => {}}
            placeholder={'Введите номер подразделения'}
            isTextInput={true}
            onIconPress={() => {
              setOtdel('');
            }}
            iconName={'close'}
            value={podrazd}
            title={'Номер подразделения'}
            setValue={txt => {
              setPodrazd(txt);
            }}
          />
          <InputField
            onSubmit={() => {}}
            placeholder={'Введите номер отдела'}
            isTextInput={true}
            iconName={'close'}
            onIconPress={() => {
              setPodrazd('');
            }}
            value={otdel}
            title={'Отдел'}
            setValue={txt => {
              setOtdel(txt);
            }}
          />
          <InputField
            onSubmit={() => {}}
            keyBoardType={'default'}
            placeholder={'Введите комментарий'}
            isTextInput={true}
            iconName={'close'}
            onIconPress={() => {
              setPodrazd('');
            }}
            value={comment}
            title={'Комментарий'}
            setValue={txt => {
              setComment(txt);
            }}
          /> */
