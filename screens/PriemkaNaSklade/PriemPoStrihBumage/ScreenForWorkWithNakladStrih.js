import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  BackHandler,
} from 'react-native';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  List,
  Subheading,
} from 'react-native-paper';
import NakladNayaStore from '../../../mobx/NakladNayaStore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import {PocketPrPda1s} from '../../../functions/PocketPrPda1s';
import {useFocusEffect} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {PocketListOb} from '../../../functions/PocketListOb';
import {createRef} from 'react';
import {MAIN_COLOR} from '../../../constants/funcrions';

const ScreenForWorkWithNakladStrih = observer(({navigation, user}) => {
  const scrl = createRef();

  useFocusEffect(
    React.useCallback(() => {
      const backAction = () => {
        NakladNayaStore.cityList.filter(r => r.checked).length
          ? null
          : navigation.goBack();
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      NakladNayaStore.loading = true;
      PocketPrPda1s(
        NakladNayaStore.nakladnayaInfo.numNakl,
        user.user.TokenData[0].$.UserUID,
        user.user.$['city.cod'],
      )
        .then(r => {
          NakladNayaStore.nakladnayaInfo = {
            ...NakladNayaStore.nakladnayaInfo,
            ListOb: r.ListOb,
          };

          PocketListOb(
            user.user.TokenData[0].$.UserUID,
            user.user.$['city.cod'],
          )
            .then(list => {
              if (list.ListOb) {
                NakladNayaStore.cityList = list.ListOb[0].ListObRow.map(
                  (r, index) => {
                    return {
                      ...r,
                      checked: NakladNayaStore.nakladnayaInfo.ListOb[0].Ob.includes(
                        r.cod_ob[0],
                      ),
                      id: index,
                      palletNumber: '',
                      qty: '',
                    };
                  },
                );
              }
              NakladNayaStore.loading = false;
            })
            .catch(e => {
              NakladNayaStore.loading = false;
              alert(e);
            });
        })
        .catch(e => {
          NakladNayaStore.loading = false;

          alert(e);
        });
    }, []),
  );

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka
        title={'Информация о накладной'}
        navigation={navigation}
        onLeftPress={() => {
          navigation.popToTop();
        }}
      />
      <Card>
        <Card.Title
          title={NakladNayaStore.nakladnayaInfo.numNakl}
          subtitle="Номер накладной"
        />
      </Card>
      <Pressable
        style={{
          height: 60,
          justifyContent: 'center',
          marginTop: 20,
          backgroundColor: 'white',
          borderRadius: 4,
        }}
        onPress={() => {
          navigation.push('ChooseOBScreen');
          //console.log(NakladNayaStore.nakladnayaInfo.ListOb);
          //scrl.current.scrollTo({x: 0, y: 0, animated: true});
        }}>
        <Subheading style={{marginHorizontal: 16}}>
          Изменить список объединений
        </Subheading>
        <View
          style={{
            position: 'absolute',
            right: 16,
          }}>
          <MaterialCommunityIcons name="chevron-right" size={20} />
        </View>
      </Pressable>
      <List.Subheader>Список выбранных объединений</List.Subheader>
      <ScrollView
        ref={scrl}
        style={{backgroundColor: 'white', marginBottom: 48}}>
        {NakladNayaStore.cityList
          .filter(r => r.checked)
          .map((r, index) => {
            return (
              <View key={index}>
                <List.Item
                  title={'Объединение ' + r.name[0]}
                  description={'Код объединения ' + r.cod_ob[0]}
                  left={() => (
                    <View
                      style={{
                        justifyContent: 'center',
                        height: 60,
                        marginHorizontal: 16,
                      }}>
                      <View
                        style={{
                          height: 4,
                          width: 4,
                          backgroundColor: 'black',
                          borderRadius: 30,
                        }}
                      />
                    </View>
                  )}
                />
              </View>
            );
          })}
      </ScrollView>
      <TouchableOpacity
        style={{
          height: 48,
          justifyContent: 'center',
          zIndex: 1000,
          backgroundColor: MAIN_COLOR,
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
        onPress={() => {
          navigation.navigate('EnterPalletsNamesToNakladnaya');
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
          Далее
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(ScreenForWorkWithNakladStrih);
