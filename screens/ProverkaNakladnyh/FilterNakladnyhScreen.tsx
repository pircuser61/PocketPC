import {observer} from 'mobx-react-lite';
import React, {useState, useEffect, useRef} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import EmptyListComponent from '../../components/SystemComponents/EmptyListComponent';
import ErrorAndUpdateComponent from '../../components/SystemComponents/ErrorAndUpdateComponent';
import RecycleList from '../../components/SystemComponents/RecycleList';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import {PocketProvperShops} from '../../functions/PocketProvperShops';
import UserStore from '../../mobx/UserStore';
import {ProverkaNakladnyhNavProps, ShopsRow} from '../../types/types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Divider} from 'react-native-paper';
import {MAIN_COLOR, timeout} from '../../constants/funcrions';
import ProverkaNakladnyhStore from '../../mobx/ProverkaNakladnyhStore';

type Props = NativeStackScreenProps<
  ProverkaNakladnyhNavProps,
  'FilterNakladnyhScreen'
>;

const FilterNakladnyhScreen = observer((props: Props) => {
  const [list, setlist] = useState<ShopsRow[]>([]);
  const [error, seterror] = useState('');
  const [loading, setloading] = useState(true);
  const [filter, setfilter] = useState('');
  let mounted = true;

  const ref = useRef<any>(null);
  const ITEM_HEIGHT = 60;

  const getShopsList = async () => {
    try {
      setloading(true);
      //await timeout(1000);
      const response = await PocketProvperShops({
        City: UserStore.user?.['city.cod'],
        UID: UserStore.user?.UserUID,
      });

      if (mounted) setlist(response);
    } catch (error) {
      console.log(error);
    } finally {
      if (mounted) {
        setloading(false);
      }
    }
  };

  useEffect(() => {
    getShopsList();
    return () => {
      mounted = false;
    };
  }, []);

  const renderItem = React.useCallback(
    (type: any, item: ShopsRow) => {
      'worklet';
      return (
        <TouchableOpacity
          onPress={() => {
            props.route.params.getList(
              item.CodShop,
              ProverkaNakladnyhStore.Type,
            );
            props.navigation.goBack();
          }}
          style={{
            marginTop: 10,
            marginRight: 0,
            opacity: 1,
            marginLeft: 16,
          }}>
          <Text style={{fontSize: 20}}>{item.CodShop}</Text>
          <Text
            numberOfLines={1}
            style={{
              fontSize: 14,
              opacity: 0.6,
              fontWeight: '400',
              marginBottom: 10,
              marginRight: 32,
            }}>
            {item.NameShop}
          </Text>
          <MaterialCommunityIcons
            name="chevron-right"
            size={24}
            color="black"
            style={{position: 'absolute', right: 16, marginTop: 10}}
          />
          <Divider />
        </TouchableOpacity>
      );
    },
    [list],
  );

  return (
    <ScreenTemplate
      {...props}
      title={'Фильтр'}
      needsearchBar={true}
      value={filter}
      placeholder={'Введите номер подраздленеия'}
      onChangeText={setfilter}>
      <View style={{flex: 1}}>
        {error.length > 0 ? (
          <ErrorAndUpdateComponent
            error={error}
            update={() => getShopsList()}
          />
        ) : loading ? (
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <ActivityIndicator size={26} color={MAIN_COLOR} />
          </View>
        ) : list.filter(r => r.CodShop.includes(filter)).length > 0 ? (
          <RecycleList
            data={list.filter(r => r.CodShop.includes(filter))}
            customref={ref}
            refreshing={loading}
            itemHeight={ITEM_HEIGHT}
            _rowRenderer={renderItem}
          />
        ) : (
          <EmptyListComponent />
        )}
      </View>
    </ScreenTemplate>
  );
});

export default FilterNakladnyhScreen;

const styles = StyleSheet.create({});
