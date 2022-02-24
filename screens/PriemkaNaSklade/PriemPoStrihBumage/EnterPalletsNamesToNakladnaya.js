import {observer} from 'mobx-react-lite';
import React, {useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {Card, List, Title} from 'react-native-paper';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import NakladNayaStore from '../../../mobx/NakladNayaStore';
import {Searchbar} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MAIN_COLOR, TOGGLE_SCANNING} from '../../../constants/funcrions';
import {useState} from 'react';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {connect} from 'react-redux';
import {PocketPrPda4sPal} from '../../../functions/PocketPrPda4sPal';

const EnterPalletsNamesToNakladnaya = observer(({navigation, user}) => {
  const [chosenId, setChosenId] = useState(null);
  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;

  useEffect(() => {
    if (barcode.data !== '') {
      if (typeof chosenId === 'number') {
        console.log('ХУК СРАБОТАл c индексом ' + chosenId);
        NakladNayaStore.cityList[chosenId].palletNumber = barcode.data;
        setBarcode({data: '', time: '', type: ''});
      }
    }
  }, [barcode, chosenId]);

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka title={'Укажите паллеты'} navigation={navigation} />
      <Card>
        <Card.Title
          title={NakladNayaStore.nakladnayaInfo.numNakl}
          subtitle="Номер накладной"
        />
      </Card>
      <ScrollView style={{marginBottom: 48}}>
        {NakladNayaStore.cityList
          .filter(r => r.checked)
          .map((r, index) => {
            return (
              <Pressable
                onPress={() => {
                  console.log(r);
                  setChosenId(r.id);
                }}
                key={index}
                style={{
                  backgroundColor: r.id === chosenId ? 'grey' : 'white',
                  height: 100,
                  justifyContent: 'center',
                  marginHorizontal: 8,
                  marginVertical: 4,
                  borderRadius: 8,
                }}>
                <Text style={{fontWeight: 'bold', marginLeft: 16}}>
                  Паллет {r.name[0]}
                </Text>
                <TextInput
                  style={styles.input}
                  onChangeText={text => {
                    NakladNayaStore.cityList[r.id].palletNumber = text;
                  }}
                  value={NakladNayaStore.cityList[r.id].palletNumber}
                  placeholder="Введите номер паллеты"
                  keyboardType="numeric"
                />
                <TouchableOpacity
                  style={{position: 'absolute', right: 44, padding: 20}}
                  onPress={() => {
                    NakladNayaStore.cityList[r.id].palletNumber = '';
                  }}>
                  <MaterialCommunityIcons
                    name="close-circle-outline"
                    size={24}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={{position: 'absolute', right: 0, padding: 20}}
                  onPress={() => {
                    setChosenId(r.id);
                    TOGGLE_SCANNING();
                  }}>
                  <MaterialCommunityIcons name="barcode-scan" size={24} />
                </TouchableOpacity>
              </Pressable>
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
          NakladNayaStore.loading = true;
          //navigation.navigate('EnterPalletsNamesToNakladnaya');
          //console.log(123);
          PocketPrPda4sPal(
            NakladNayaStore.nakladnayaInfo.IdNum,
            NakladNayaStore.cityList.filter(r => r.checked),
            user.user.TokenData[0].$.UserUID,
            user.user.$['city.cod'],
          )
            .then(r => {
              NakladNayaStore.loading = false;
              navigation.navigate('ItemStrihList');
              console.log(r);
            })
            .catch(e => {
              NakladNayaStore.loading = false;
              alert(e);

              console.log(e);
            });
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
          Далее
        </Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderBottomWidth: 0.5,
    width: '70%',
  },
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(EnterPalletsNamesToNakladnaya);

/**
 *  <List.Item
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
 */
