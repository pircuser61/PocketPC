import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {alertActions, timeout} from '../../constants/funcrions';
import {
  GoodsRow,
  PocketProvfreeGoods,
} from '../../functions/PocketProvfreeGoods';
import {
  PocketProvfreeList,
  ProvfreeRow,
} from '../../functions/PocketProvfreeList';
import UserStore from '../../mobx/UserStore';
import {GoodsInVykladkaScreenProps} from '../../screens/Vykladka/GoodsInVykladkaScreen';

export interface IFilter {
  FilterUid?: string;
  FilterShop?: string;
}

export type TCmd =
  | 'first'
  | 'curr'
  | 'next'
  | 'prev'
  | 'last'
  | 'create'
  | 'find';

const GoodsInVykladkaHook = ({
  NumNakl,
  navigation,
  canEdit,
}: {NumNakl: string; canEdit: boolean} & GoodsInVykladkaScreenProps) => {
  let mounted = true;
  const [error, setError] = useState('');
  const [goodInfo, setGoodInfo] = useState<GoodsRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [miniError, setminiError] = useState('');
  const [relativePosition, setRelativePosition] = useState<{
    first?: GoodsRow;
    last?: GoodsRow;
  }>({});

  useEffect(() => {
    getFirst();
    return () => {
      mounted = false;
    };
  }, []);

  const getGoodInfo = async ({
    Cmd,
    Barcod,
    CodGood,
    isSecondScreen = false,
  }: {
    Cmd: TCmd;
    CodGood?: string;
    Barcod?: string;
    isSecondScreen?: boolean;
  }) => {
    try {
      setError('');
      setminiError('');
      setLoading(true);
      const response = await PocketProvfreeGoods({
        City: UserStore.user?.['city.cod'],
        UID: UserStore.user?.UserUID,
        Cmd,
        CurrShop: UserStore.podrazd.Id,
        NumNakl,
        CodGood,
        Barcod,
      });
      if (mounted) {
        setGoodInfo(response);
      }

      switch (Cmd) {
        case 'first':
          setRelativePosition({...relativePosition, first: response});
          break;
        case 'last':
          setRelativePosition({...relativePosition, last: response});
          break;
        case 'create':
        case 'prev':
        case 'next':
          if (!!relativePosition.first) {
            if (
              Number(response.CodGood ?? 0) <
              Number(relativePosition.first.CodGood)
            ) {
              setRelativePosition({
                ...relativePosition,
                first: response,
              });
              console.log('FIRST: ' + response.CodGood);
              console.log('SECOND: ' + relativePosition.first.CodGood);
            }
          }
          if (!!relativePosition.last) {
            if (
              Number(response.CodGood ?? 0) >
              Number(relativePosition.last.CodGood)
            ) {
              setRelativePosition({
                ...relativePosition,
                last: response,
              });
              console.log('FIRST: ' + response.CodGood);
              console.log('SECOND: ' + relativePosition.last.CodGood);
            }
          }
          break;
        default:
          break;
      }
    } catch (err) {
      if (isSecondScreen) {
        throw err;
      }
      if (typeof err === 'string') {
        const error = err + '';

        if (error === 'Вы в конце списка') {
          setRelativePosition({
            ...relativePosition,
            last: goodInfo as GoodsRow,
          });

          setminiError('Вы в конце списка');
        } else if (error === 'Вы в начале списка') {
          setRelativePosition({
            ...relativePosition,
            first: goodInfo as GoodsRow,
          });
          setminiError('Вы в начале списка');
        } else if (error === 'Пусто' && (Cmd === 'first' || Cmd === 'last')) {
          setGoodInfo(null);
        } else alertActions(err);
      } else alertActions(err);
    } finally {
      if (mounted) setLoading(false);
    }
  };

  const getFirst = () => {
    getGoodInfo({Cmd: 'first'});
  };

  const getLast = () => {
    getGoodInfo({Cmd: 'last'});
  };

  const getNext = () => {
    getGoodInfo({Cmd: 'next', CodGood: goodInfo?.CodGood});
  };

  const getPrev = () => {
    getGoodInfo({Cmd: 'prev', CodGood: goodInfo?.CodGood});
  };

  const addOrFindGood = async (Barcod: string, isSecondScreen = false) => {
    try {
      if (canEdit) {
        await getGoodInfo({Cmd: 'create', Barcod, isSecondScreen});
      } else await getGoodInfo({Cmd: 'find', Barcod, isSecondScreen});
    } catch (error) {
      throw error;
    }
  };

  return {
    goodInfo,
    getGoodInfo,
    loading,
    getFirst,
    getLast,
    getPrev,
    getNext,
    miniError,
    error,
    relativePosition,
    setGoodInfo,
    addOrFindGood,
  };
};

export default GoodsInVykladkaHook;

const styles = StyleSheet.create({});
