import {observer} from 'mobx-react-lite';
import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {connect} from 'react-redux';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import BigSquareInfo from '../../components/RelocatePallets/BigSquareInfo';
import ChangeQtyComp from '../../components/RelocatePallets/ChangeQtyComp';
import {PocketPalPlaceInf} from '../../functions/PocketPalPlaceInf';
import RelocaPalletsteStore from '../../mobx/RelocaPalletsteStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {PocketPalPlaceSet} from '../../functions/PocketPalPlaceSet';
import {alertActions} from '../../constants/funcrions';
import {useRef} from 'react';

const ChangeLocation = observer(props => {
  const {route, navigation, user, podrazd} = props;
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingReplace, setLoadingReplace] = useState(false);
  const [update, setUpdate] = useState(false);
  let mounted = true;
  useEffect(() => {
    mounted = true;
    setTimeout(() => {
      if (mounted) {
        setLoading(true);
        PocketPalPlaceInf(
          RelocaPalletsteStore.changeLocation.Floor,
          RelocaPalletsteStore.changeLocation.Place,
          RelocaPalletsteStore.changeLocation.Rack,
          RelocaPalletsteStore.changeLocation.Sector,
          user.user.TokenData[0].$.UserUID,
          user.user.$['city.cod'],
          podrazd.Id,
        )
          .then(r => {
            setTimeout(() => {
              if (mounted) {
                console.log(r);
                setStatus(r);
                setLoading(false);
              }
            }, 300);
          })
          .catch(e => {
            setTimeout(() => {
              if (mounted) {
                console.log(e);
                setStatus(e);
                setLoading(false);
              }
            }, 300);
          });
      }
    }, 300);

    return () => {
      mounted = false;
      setLoading(false);
    };
  }, [
    RelocaPalletsteStore.changeLocation.Floor,
    RelocaPalletsteStore.changeLocation.Place,
    RelocaPalletsteStore.changeLocation.Sector,
    RelocaPalletsteStore.changeLocation.Rack,
    update,
  ]);

  const createTwoButtonAlert = () =>
    Alert.alert(
      'Внимание!',
      `Вы хотите перенести паллету ${RelocaPalletsteStore.fullPalletInfo.NumPal} в место с состоянием ${status}\nИз: этаж: ${RelocaPalletsteStore.fullPalletInfo.Floor}, место: ${RelocaPalletsteStore.fullPalletInfo.Place}, сектор: ${RelocaPalletsteStore.fullPalletInfo.Sector}, стелаж: ${RelocaPalletsteStore.fullPalletInfo.Rack};\nВ: этаж: ${RelocaPalletsteStore.changeLocation.Floor}, место: ${RelocaPalletsteStore.changeLocation.Place}, сектор: ${RelocaPalletsteStore.changeLocation.Sector}, стелаж: ${RelocaPalletsteStore.changeLocation.Rack};`,
      [
        {
          text: 'Отмена',
          onPress: () => console.log('Нажали отмена'),
          style: 'cancel',
        },
        {text: 'Да', onPress: () => setData()},
      ],
    );

  useEffect(() => {
    console.log(podrazd);
    let newSector = RelocaPalletsteStore.fullPalletInfo.Sector;
    if (podrazd.Id === '909') {
      newSector = '1';
    }
    if (podrazd.Id === '770') {
      newSector = '1';
    }

    RelocaPalletsteStore.changeLocation = {
      Sector: newSector,
      Rack: RelocaPalletsteStore.fullPalletInfo.Rack,
      Floor: RelocaPalletsteStore.fullPalletInfo.Floor,
      Place: RelocaPalletsteStore.fullPalletInfo.Place,
    };

    return () => {
      RelocaPalletsteStore.changeLocation = {
        Sector: '',
        Rack: '',
        Floor: '',
        Place: '',
      };
    };
  }, []);

  function isNumber(str) {
    var pattern = /^\d+$/;
    return pattern.test(str); // returns a boolean
  }

  const setData = () => {
    setLoadingReplace(true);
    const {Rack, Floor, Place, Sector} = RelocaPalletsteStore.changeLocation;

    PocketPalPlaceSet(
      Floor,
      Place,
      Rack,
      Sector,
      RelocaPalletsteStore.palletNumber,
      podrazd.Id,
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        navigation.goBack();
        setLoadingReplace(false);
      })
      .catch(e => {
        alertActions(e);
        setLoadingReplace(false);
      });
  };

  const secrorRef = useRef(null);
  const rackRef = useRef(null);
  const floorRef = useRef(null);
  const placeRef = useRef(null);

  useEffect(() => {
    if (podrazd.Id === '770' || podrazd.Id === '909') rackRef.current.focus();
    else secrorRef.current.focus();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={{flex: 1}}>
        <HeaderPriemka
          {...props}
          title={'Паллета номер: ' + RelocaPalletsteStore.fullPalletInfo.NumPal}
        />
        <ScrollView style={{flex: 1}}>
          <View style={{margin: 16}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                marginBottom: 16,
              }}>
              <ChangeQtyComp
                title={'Сектор'}
                blurOnSubmit={false}
                keystroke={'Sector'}
                editable={
                  podrazd.Id === '770' || podrazd.Id === '909' ? false : true
                }
                ref={secrorRef}
                valueFullInfo={RelocaPalletsteStore.fullPalletInfo.Sector}
              />
              <ChangeQtyComp
                title={'Стеллаж'}
                blurOnSubmit={false}
                keystroke={'Rack'}
                ref={rackRef}
                valueFullInfo={RelocaPalletsteStore.fullPalletInfo.Rack}
                onSubmit={() => {
                  floorRef.current.focus();
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <ChangeQtyComp
                title={'Этаж'}
                keystroke={'Floor'}
                ref={floorRef}
                blurOnSubmit={false}
                valueFullInfo={RelocaPalletsteStore.fullPalletInfo.Floor}
                onSubmit={() => {
                  placeRef.current.focus();
                }}
              />
              <ChangeQtyComp
                title={'Место'}
                keystroke={'Place'}
                ref={placeRef}
                blurOnSubmit={true}
                valueFullInfo={RelocaPalletsteStore.fullPalletInfo.Place}
                onSubmit={() => {
                  if (
                    RelocaPalletsteStore.changeLocation.Floor &&
                    RelocaPalletsteStore.changeLocation.Rack &&
                    RelocaPalletsteStore.changeLocation.Place &&
                    RelocaPalletsteStore.changeLocation.Sector &&
                    isNumber(status) &&
                    !loading &&
                    !loadingReplace
                  ) {
                    createTwoButtonAlert();
                  }
                }}
              />
            </View>
            <TouchableOpacity
              disabled={loadingReplace}
              onPress={() => {
                setUpdate(!update);
              }}>
              <BigSquareInfo
                title={'Состояние'}
                data={status}
                loading={loading}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                createTwoButtonAlert();
              }}
              disabled={
                !RelocaPalletsteStore.changeLocation.Floor ||
                !RelocaPalletsteStore.changeLocation.Rack ||
                !RelocaPalletsteStore.changeLocation.Place ||
                !RelocaPalletsteStore.changeLocation.Sector ||
                !isNumber(status) ||
                loading ||
                loadingReplace
              }>
              <View
                style={{
                  //height: 70,
                  //width: 70,
                  backgroundColor: 'white',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: 8,
                  margin: 16,
                  padding: 16,
                  marginBottom: 0,
                  borderWidth: isNumber(status) ? 0.4 : 0,
                }}>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: 'bold',
                    color: isNumber(status) ? 'black' : 'grey',
                  }}>
                  Изменить место
                </Text>
                {loadingReplace ? (
                  <ActivityIndicator
                    color={'black'}
                    style={{position: 'absolute', right: 12}}
                  />
                ) : null}
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </TouchableWithoutFeedback>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(ChangeLocation);

const styles = StyleSheet.create({});

/**  // setLoading(true);

                // PocketPalPlaceInf(
                //   RelocaPalletsteStore.changeLocation.Floor,
                //   RelocaPalletsteStore.changeLocation.Place,
                //   RelocaPalletsteStore.changeLocation.Rack,
                //   RelocaPalletsteStore.changeLocation.Sector,
                //   user.user.TokenData[0].$.UserUID,
                //   user.user.$['city.cod'],
                //   podrazd.Id,
                // )
                //   .then(r => {
                //     setTimeout(() => {
                //       if (loading) console.log(r);
                //       setStatus(r);
                //       setLoading(false);
                //     }, 500);
                //   })
                //   .catch(e => {
                //     setTimeout(() => {
                //       console.log(e);
                //       setStatus(e);
                //       setLoading(false);
                //     }, 200);
                //   }); */
