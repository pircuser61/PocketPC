import {observer} from 'mobx-react-lite';
import React, {useCallback, useEffect, useState} from 'react';
import {
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableNativeFeedback,
  View,
} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import LoadingFlexComponent from '../../components/SystemComponents/LoadingFlexComponent';
import PressBotBar from '../../components/SystemComponents/PressBotBar';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import SizedBox from '../../components/SystemComponents/SizedBox';
import {alertActions, timeout} from '../../constants/funcrions';
import {PocketProvfreeCreate} from '../../functions/PocketProvfreeCreate';
import {ProvfreeRow} from '../../functions/PocketProvfreeList';
import {PocketProvfreeUpdate} from '../../functions/PocketProvfreeUpdate';
import MountedHook from '../../hooks/SystemHook/MountedHook';
import UserStore from '../../mobx/UserStore';
import {VykladkaNavProps} from '../../navigation/Vykladka/VykladkaNav';
import {TICustom} from '../ProverkaPallets/CreateCheckScreen';

type Props = NativeStackScreenProps<VykladkaNavProps, 'AddNewVykladla'>;

const AddNewVykladla = observer((props: Props) => {
  const currentdate = new Date();
  const {
    mode,
    propitem,
    addNewElementToList,
    changeElementInList,
  } = props.route.params;

  let mounted = true;
  const [loading, setLoading] = useState(false);
  const [error, seterror] = useState('');
  const [comment, setcomment] = useState(
    propitem?.Comment ??
      currentdate.getHours() +
        ':' +
        (currentdate.getMinutes() < 10 ? '0' : '') +
        currentdate.getMinutes(),
  );

  const pressBot = () => {
    if (mode === 'create') {
      createNewVykladka();
    } else if (mode === 'edit') {
      editVykladka();
    } else alertActions('Режим работы с проверкой не выбран');
  };

  const createNewVykladka = useCallback(async () => {
    try {
      seterror('');
      setLoading(true);
      const response = await PocketProvfreeCreate({
        City: UserStore.user?.['city.cod'],
        Comment: comment,
        UID: UserStore.user?.UserUID,
        CurrShop: UserStore.podrazd.Id,
      });
      props.route.params.addNewElementToList(response as ProvfreeRow);
      props.navigation.goBack();
    } catch (error) {
      console.log(mounted);

      if (mounted) {
        alertActions(error);
        setLoading(false);
        seterror('' + error);
      }
    }
  }, [mounted]);

  const editVykladka = useCallback(async () => {
    try {
      seterror('');
      setLoading(true);
      const response = await PocketProvfreeUpdate({
        City: UserStore.user?.['city.cod'],
        Comment: comment,
        UID: UserStore.user?.UserUID,
        CurrShop: UserStore.podrazd.Id,
        NumNakl: propitem?.NumNakl,
      });
      changeElementInList(response as ProvfreeRow);
      props.navigation.goBack();
    } catch (error) {
      setLoading(false);
      seterror('' + error);
    }
  }, [mounted, comment]);

  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <Pressable onPress={Keyboard.dismiss} style={{flex: 1}}>
      <ScreenTemplate
        {...props}
        title={mode === 'edit' ? 'Редактирование проверки' : 'Новая проверка'}>
        <View style={{padding: 16, flex: 1}}>
          <TICustom
            onChangeText={setcomment}
            value={comment}
            title={'Комментарий'}
          />
          <SizedBox h={8} />
          <Text style={{fontWeight: 'bold'}}>
            {UserStore.podrazd.Name} {UserStore.podrazd.CodOb}
          </Text>
          {error.length > 0 && (
            <Text style={{color: 'red', alignSelf: 'center'}}>{error}</Text>
          )}
          {loading && <LoadingFlexComponent />}
        </View>

        <PressBotBar
          disabled={loading}
          title={mode === 'edit' ? 'Редактировать' : 'Добавить'}
          onPress={mode === 'edit' ? editVykladka : createNewVykladka}
        />
      </ScreenTemplate>
    </Pressable>
  );
});

export default AddNewVykladla;

const styles = StyleSheet.create({});
