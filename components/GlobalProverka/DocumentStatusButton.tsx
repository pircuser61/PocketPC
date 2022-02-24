import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {alertActions, MAIN_COLOR} from '../../constants/funcrions';
import {PocketProvSpecsCheck} from '../../functions/PocketProvSpecsCheck';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import UserStore from '../../mobx/UserStore';
import {GoodsRow} from '../../types/ProverkaTypes';

/**
 *  NumDoc: item.NumDoc,
      NumNakl: item.NumNakl,
 */

const DocumentStatusButton = observer(
  ({
    NumDoc,
    NumNakl,
    goodInfo,
  }: {
    NumDoc: string;
    NumNakl: string;
    goodInfo: GoodsRow | null;
  }) => {
    const [status, setStatus] = useState('');
    const [didWithError, setdidWithError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [didChange, setDidChange] = useState(false);

    useEffect(() => {
      setDidChange(true);
    }, [goodInfo]);

    const getStatusOfDoc = async () => {
      try {
        setLoading(true);
        setDidChange(false);
        const res = await PocketProvSpecsCheck({
          City: UserStore.user?.['city.cod'],
          UID: UserStore.user?.UserUID,
          NumDoc,
          NumNakl,
          Type: CheckPalletsStore.Type,
        });
        //throw 'sas';
        setdidWithError(false);
        setStatus(res + '');
      } catch (error) {
        setdidWithError(true);
        alertActions(error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
      getStatusOfDoc();
    }, [didWithError]);

    useEffect(() => {});

    return (
      <TouchableOpacity
        onPress={getStatusOfDoc}
        style={[
          styles.buttonCircle,
          {
            opacity: 1,
            width: undefined,
            paddingHorizontal: 16,
          },
        ]}>
        {didChange ? (
          <Text style={{color: 'white', fontWeight: 'bold'}}>Обновить?</Text>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Статус: </Text>
            {loading ? (
              <ActivityIndicator size={12} color={'white'} />
            ) : (
              <Text style={{color: 'white', fontWeight: 'bold'}}>
                {!didWithError ? '"' + status + '"' : 'Ошибка!'}
              </Text>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  },
);

export default DocumentStatusButton;

const styles = StyleSheet.create({
  navigationArrows: {
    height: 60,
    width: 60,
    backgroundColor: MAIN_COLOR,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonCircle: {
    backgroundColor: MAIN_COLOR,
    height: 50,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
});
