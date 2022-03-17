import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {alertActions, timeout} from '../../constants/funcrions';
import {
  PocketProvfreeList,
  ProvfreeRow,
} from '../../functions/PocketProvfreeList';
import UserStore from '../../mobx/UserStore';

export interface IFilter {
  FilterUid?: string;
  FilterShop?: string;
}

const VykladkaStartHook = () => {
  const [list, setlist] = useState<ProvfreeRow[]>([]);
  const [loading, setloading] = useState(true);
  const [filterModal, setfilterModal] = useState(false);

  const ref = useRef<any>(null);
  const [filter, setfilter] = useState<IFilter>({
    FilterShop: UserStore.podrazd.Id,
    FilterUid: UserStore.user?.UserUID,
  });
  const [chossen, setchossen] = useState('');

  let mounted = true;

  const addNewElementToList = (item: ProvfreeRow) => {
    const newList = [...list, item];
    setchossen(item.NumNakl);
    setlist(newList);
    setTimeout(() => {
      ref?.current?.scrollToIndex(newList.length - 1, true);
    }, 150);
  };

  const changeElementInList = (item: ProvfreeRow) => {
    let futureIndex: number | null = null;
    const newList = list.map((r, i) => {
      if (r.NumNakl === item.NumNakl) {
        futureIndex = i;
        return item;
      } else return r;
    });
    setchossen(item.NumNakl);
    setlist(newList);
    setTimeout(() => {
      ref?.current?.scrollToIndex(futureIndex, true);
    }, 150);
  };

  const openFilter = () => setfilterModal(true);
  const closeFilter = () => setfilterModal(false);

  const getList = async (filter: IFilter) => {
    try {
      setloading(true);
      const response = await PocketProvfreeList({
        City: UserStore.user?.['city.cod'],
        UID: UserStore.user?.UserUID,
        CurrShop: UserStore.podrazd.Id,
        // FilterShop: '201',
        // FilterUid: '25103',
        FilterShop: filter.FilterShop,
        FilterUid: filter.FilterUid,
      });
      if (mounted) {
        setlist(response);
        setfilter(filter);
      }
    } catch (error) {
      if (mounted) alertActions(error);
    } finally {
      if (mounted) {
        setloading(false);
      }
    }
  };

  useEffect(() => {
    getList(filter);
  }, []);

  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, []);

  return {
    list,
    loading,
    filter,
    ref,
    filterModal,
    openFilter,
    closeFilter,
    setfilter,
    addNewElementToList,
    chossen,
    setchossen,
    getList,
    changeElementInList,
  };
};

export default VykladkaStartHook;

const styles = StyleSheet.create({});
