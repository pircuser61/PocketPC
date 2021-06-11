import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import InputField from '../../components/Perepalechivanie/InputField';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import {alertActions, TOGGLE_SCANNING} from '../../constants/funcrions';
import BackToPostavshikStore from '../../mobx/BackToPostavshikStore';
import RelocaPalletsteStore from '../../mobx/RelocaPalletsteStore';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import {PocketPalPlaceGet} from '../../functions/PocketPalPlaceGet';
import {connect} from 'react-redux';
import SquareInfo from '../../components/RelocatePallets/SquareInfo';
import BigSquareInfo from '../../components/RelocatePallets/BigSquareInfo';
import ButtonBot from '../../components/PriemkaNaSklade/ButtonBot';
import RelocateModal from '../../components/RelocatePallets/RelocateModal';
import {useState} from 'react';
import {useFocusEffect} from '@react-navigation/native';
import Header from '../../components/PechatKM/Header';

const StartRelocate = observer(props => {
  const api = PriemMestnyhHook();

  const {barcode, setBarcode} = api;

  const {user, navigation, podrazd} = props;
  const [visible, setVisible] = useState(false);

  const getPalletLocationInfo = data => {
    RelocaPalletsteStore.loadingPalletInfo = true;
    PocketPalPlaceGet(
      data,
      podrazd.Id,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        console.log(r);
        RelocaPalletsteStore.fullPalletInfo = r;
        RelocaPalletsteStore.loadingPalletInfo = false;
      })
      .catch(e => {
        alertActions(e);
        RelocaPalletsteStore.loadingPalletInfo = false;
      });
  };

  useEffect(() => {
    if (barcode.data && !RelocaPalletsteStore.fullPalletInfo.ready) {
      RelocaPalletsteStore.palletNumber = barcode.data;
      getPalletLocationInfo(barcode.data);
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  useEffect(() => {
    RelocaPalletsteStore.resetStore();
    return () => {
      RelocaPalletsteStore.resetStore();
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (RelocaPalletsteStore.palletNumber)
        getPalletLocationInfo(RelocaPalletsteStore.palletNumber);
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <Header
        printer={'Размещение паллет'}
        user={user}
        navigation={navigation}
        emptyheader={true}
        reload={() => {
          Keyboard.dismiss();
          RelocaPalletsteStore.resetStore();
        }}
      />
      <ScrollView style={{flex: 1}}>
        <InputField
          title={'Номер паллеты'}
          placeholder={'Номер паллеты'}
          //iconName={'information-outline'}
          onIconPress={() => {
            RelocaPalletsteStore.palletNumber
              ? RelocaPalletsteStore.fullPalletInfo.ready
                ? RelocaPalletsteStore.clearFullPalletInfo()
                : getPalletLocationInfo(RelocaPalletsteStore.palletNumber)
              : TOGGLE_SCANNING();
          }}
          value={RelocaPalletsteStore.palletNumber}
          onSubmit={() => {
            getPalletLocationInfo(RelocaPalletsteStore.palletNumber);
          }}
          setValue={txt => (RelocaPalletsteStore.palletNumber = txt)}
          onChangeText={() => {
            //PerepalechivanieStore.parrentId = '';
          }}
          loading={RelocaPalletsteStore.loadingPalletInfo}
          isTextInput={RelocaPalletsteStore.fullPalletInfo.ready ? false : true}
          iconName={
            RelocaPalletsteStore.palletNumber
              ? RelocaPalletsteStore.fullPalletInfo.ready
                ? 'close'
                : 'check'
              : 'barcode-scan'
          }
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 16,
          }}>
          <SquareInfo
            data={RelocaPalletsteStore.fullPalletInfo.CodOb}
            title={'Объед'}
          />
          <SquareInfo
            data={RelocaPalletsteStore.fullPalletInfo.CodShop}
            title={'Подр.'}
          />
          <SquareInfo
            data={RelocaPalletsteStore.fullPalletInfo.CodDep}
            title={'Отдел'}
          />
          <SquareInfo
            data={RelocaPalletsteStore.fullPalletInfo.CodFirm}
            title={'Код пост.'}
          />
        </View>

        <BigSquareInfo
          data={RelocaPalletsteStore.fullPalletInfo.NameFirm}
          title={'Название фирмы'}
        />
        <BigSquareInfo
          data={RelocaPalletsteStore.fullPalletInfo.Comment}
          title={'Комментарий'}
        />
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('ChangeLocation');
          }}
          disabled={!RelocaPalletsteStore.fullPalletInfo.ready}
          style={{
            //height: 70,
            //width: 70,
            backgroundColor: 'white',
            alignItems: true ? 'flex-start' : 'center',
            justifyContent: 'center',
            borderRadius: 8,
            margin: 16,
            padding: 16,
            //marginBottom: 0,
            borderWidth: RelocaPalletsteStore.fullPalletInfo.ready ? 0.4 : 0,
          }}>
          <Text style={{fontSize: 10, fontWeight: 'bold'}}>Размещение:</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              //marginHorizontal: 16,
              //borderWidth: 1,
              alignSelf: 'center',
              width: '100%',
            }}>
            <SquareInfo
              data={RelocaPalletsteStore.fullPalletInfo.Sector}
              title={'Сектор'}
            />
            <SquareInfo
              data={RelocaPalletsteStore.fullPalletInfo.Rack}
              title={'Стеллаж'}
            />
            <SquareInfo
              data={RelocaPalletsteStore.fullPalletInfo.Floor}
              title={'Этаж'}
            />
            <SquareInfo
              data={RelocaPalletsteStore.fullPalletInfo.Place}
              title={'Место'}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(StartRelocate);

const styles = StyleSheet.create({});

/**
 * import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import InputField from '../../components/Perepalechivanie/InputField';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import {alertActions, TOGGLE_SCANNING} from '../../constants/funcrions';
import BackToPostavshikStore from '../../mobx/BackToPostavshikStore';
import RelocaPalletsteStore from '../../mobx/RelocaPalletsteStore';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import {PocketPalPlaceGet} from '../../functions/PocketPalPlaceGet';
import {connect} from 'react-redux';
import SquareInfo from '../../components/RelocatePallets/SquareInfo';
import BigSquareInfo from '../../components/RelocatePallets/BigSquareInfo';
import ButtonBot from '../../components/PriemkaNaSklade/ButtonBot';

const StartRelocate = observer(props => {
  const api = PriemMestnyhHook();

  const {barcode, setBarcode} = api;

  const {user, navigation, podrazd} = props;

  const getPalletLocationInfo = data => {
    RelocaPalletsteStore.loadingPalletInfo = true;
    PocketPalPlaceGet(
      data,
      podrazd.Id,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        RelocaPalletsteStore.fullPalletInfo = r;
        RelocaPalletsteStore.loadingPalletInfo = false;
      })
      .catch(e => {
        alertActions(e);
        RelocaPalletsteStore.loadingPalletInfo = false;
      });
  };

  useEffect(() => {
    if (barcode.data && !RelocaPalletsteStore.fullPalletInfo.ready) {
      RelocaPalletsteStore.palletNumber = barcode.data;
      getPalletLocationInfo(barcode.data);
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode]);

  useEffect(() => {
    return () => {
      RelocaPalletsteStore.resetStore();
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka {...props} title={'Размещение паллет'} />
      <ScrollView style={{flex: 1}}>
        <InputField
          title={'Номер паллеты'}
          placeholder={'Номер паллеты'}
          //iconName={'information-outline'}
          onIconPress={() => {
            RelocaPalletsteStore.palletNumber
              ? RelocaPalletsteStore.fullPalletInfo.ready
                ? RelocaPalletsteStore.clearFullPalletInfo()
                : getPalletLocationInfo(RelocaPalletsteStore.palletNumber)
              : TOGGLE_SCANNING();
          }}
          value={RelocaPalletsteStore.palletNumber}
          onSubmit={() => {
            getPalletLocationInfo(RelocaPalletsteStore.palletNumber);
          }}
          setValue={txt => (RelocaPalletsteStore.palletNumber = txt)}
          onChangeText={() => {
            //PerepalechivanieStore.parrentId = '';
          }}
          loading={RelocaPalletsteStore.loadingPalletInfo}
          isTextInput={RelocaPalletsteStore.fullPalletInfo.ready ? false : true}
          iconName={
            RelocaPalletsteStore.palletNumber
              ? RelocaPalletsteStore.fullPalletInfo.ready
                ? 'close'
                : 'check'
              : 'barcode-scan'
          }
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginHorizontal: 16,
          }}>
          <SquareInfo
            data={RelocaPalletsteStore.fullPalletInfo.CodOb}
            title={'Объед'}
          />
          <SquareInfo
            data={RelocaPalletsteStore.fullPalletInfo.CodShop}
            title={'Подр.'}
          />
          <SquareInfo
            data={RelocaPalletsteStore.fullPalletInfo.CodDep}
            title={'Отдел'}
          />
          <SquareInfo
            data={RelocaPalletsteStore.fullPalletInfo.CodFirm}
            title={'Код пост.'}
          />
        </View>

        <BigSquareInfo
          data={RelocaPalletsteStore.fullPalletInfo.NameFirm}
          title={'Название фирмы'}
        />
        <BigSquareInfo
          data={RelocaPalletsteStore.fullPalletInfo.Comment}
          title={'Комментарий'}
        />
        <TouchableOpacity
          disabled={!RelocaPalletsteStore.fullPalletInfo.ready}
          style={{
            //height: 70,
            //width: 70,
            backgroundColor: 'white',
            alignItems: true ? 'flex-start' : 'center',
            justifyContent: 'center',
            borderRadius: 8,
            margin: 16,
            padding: 16,
            //marginBottom: 0,
          }}>
          <View
            style={{
              width: 10,
              height: 10,
              position: 'absolute',
              borderTopWidth: 1,
              borderRightWidth: 1,
              top: 8,
              right: 8,
              borderRadius: 2,
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: 'absolute',
              borderTopWidth: 1,
              borderLeftWidth: 1,
              top: 8,
              left: 8,
              borderRadius: 2,
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: 'absolute',
              borderBottomWidth: 1,
              borderRightWidth: 1,
              bottom: 8,
              right: 8,
              borderRadius: 2,
            }}
          />
          <View
            style={{
              width: 10,
              height: 10,
              position: 'absolute',
              borderBottomWidth: 1,
              borderLeftWidth: 1,
              bottom: 8,
              left: 8,
              borderRadius: 1,
            }}
          />
          <Text style={{fontSize: 10, fontWeight: 'bold'}}>Размещение:</Text>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              //marginHorizontal: 16,
            }}>
            <SquareInfo
              data={RelocaPalletsteStore.fullPalletInfo.Sector}
              title={'Сектор'}
            />
            <SquareInfo
              data={RelocaPalletsteStore.fullPalletInfo.Rack}
              title={'Стеллаж'}
            />
            <SquareInfo
              data={RelocaPalletsteStore.fullPalletInfo.Floor}
              title={'Этаж'}
            />
            <SquareInfo
              data={RelocaPalletsteStore.fullPalletInfo.Place}
              title={'Место'}
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(StartRelocate);

const styles = StyleSheet.create({});

 <View
            style={{
              height: 3,
              position: 'absolute',
              bottom: 0,
              backgroundColor: RelocaPalletsteStore.fullPalletInfo.ready
                ? '#313C47'
                : '#D1D1D1',
              alignSelf: 'center',
              paddingHorizontal: 16,
            }}
          />
          <View
            style={{
              height: 3,
              position: 'absolute',
              top: 0,
              backgroundColor: RelocaPalletsteStore.fullPalletInfo.ready
                ? '#313C47'
                : '#D1D1D1',
              alignSelf: 'center',
              paddingHorizontal: 16,
            }}
          />

 */
