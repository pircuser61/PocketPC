import {observer} from 'mobx-react-lite';
import React, {useState, useEffect} from 'react';
import {
  Keyboard,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {connect} from 'react-redux';
import SelectPalletsForShops from '../../../components/Perepalechivanie/SelectPalletsForShops';
import ButtonBot from '../../../components/PriemkaNaSklade/ButtonBot';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {alertActions} from '../../../constants/funcrions';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {PocketPerepalPalTo} from '../../../functions/PocketPerepalPalTo';
import PerepalechivanieStore from '../../../mobx/PerepalechivanieStore';
import AntDesign from 'react-native-vector-icons/AntDesign';

const SpecifyPalletsScreens = observer(props => {
  const [chosenId, setChosenId] = useState(null);

  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;
  const {navigation, user} = props;
  const clearPalletsNumbers = () => {
    setChosenId(null);
    PerepalechivanieStore.palletsList = PerepalechivanieStore.palletsList.map(
      r => ({
        ...r,
        palletNumber: '',
      }),
    );
  };

  useEffect(() => {
    if (barcode.data !== '') {
      if (typeof chosenId === 'number') {
        console.log('ХУК СРАБОТАл c индексом ' + chosenId);
        PerepalechivanieStore.palletsList[chosenId].palletNumber = barcode.data;
      } else {
        for (let i = 0; i < PerepalechivanieStore.palletsList.length; i++) {
          if (!PerepalechivanieStore.palletsList[i].palletNumber) {
            PerepalechivanieStore.palletsList[i].palletNumber = barcode.data;
            break;
          }
        }
      }
      setBarcode({data: '', time: '', type: ''});
    }
  }, [barcode, chosenId]);

  return (
    <TouchableWithoutFeedback style={{flex: 1}} onPress={Keyboard.dismiss}>
      <View style={{flex: 1}}>
        <HeaderPriemka
          {...props}
          title={'Паллеты куда\nОткуда: ' + PerepalechivanieStore.numpalFrom}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            borderWidth: 0,
            marginVertical: 8,
            paddingHorizontal: 16,
            justifyContent: 'space-between',
          }}>
          <TouchableOpacity
            onPress={() => {
              setChosenId(null);
            }}>
            <AntDesign
              name="exclamationcircleo"
              size={20}
              color="black"
              style={{}}
            />
          </TouchableOpacity>

          <Text style={{maxWidth: '80%', fontSize: 12}}>
            Нажмите на позицию, которую хотите сканировать или сканируйте по
            очереди. Чтобы удалить, долго жмите на соответствующую позицию.
            Чтобы убрать фокус, нажмите на иконку слева.
          </Text>
          <TouchableOpacity onPress={clearPalletsNumbers}>
            <AntDesign name="delete" size={20} color="black" style={{}} />
          </TouchableOpacity>
        </View>
        <Divider />

        <View style={{flex: 1}}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              margin: 16,
            }}>
            <Text style={styles.titleStyle}>Куда</Text>
            <Text style={styles.titleStyle}>Код магазина</Text>

            <Text style={styles.titleStyle}>Номер паллеты</Text>
          </View>
          <Divider />
          <ScrollView style={{marginBottom: 48}}>
            {PerepalechivanieStore.palletsList
              ? PerepalechivanieStore.palletsList.map(
                  (
                    r = {
                      $: {CodShop: '', NameMax: '', NumMax: '', order: ''},
                      palletNumber: '',
                    },
                    i,
                  ) => {
                    return (
                      <SelectPalletsForShops
                        key={i}
                        chosenId={chosenId}
                        {...r}
                        index={i}
                        onLongPress={() => {
                          PerepalechivanieStore.palletsList[i].palletNumber =
                            '';
                        }}
                        onPress={() => {
                          console.log(r);
                          setChosenId(i);
                        }}
                      />
                    );
                  },
                )
              : null}
          </ScrollView>

          <ButtonBot
            disabled={false}
            title={'Далее'}
            onPress={() => {
              setChosenId(null);
              PocketPerepalPalTo(
                PerepalechivanieStore.parrentId,
                PerepalechivanieStore.numpalFrom,
                '',
                'false',
                PerepalechivanieStore.palletsList,
                user.user.TokenData[0].$.UserUID,
                user.user.$['city.cod'],
              )
                .then(r => {
                  PerepalechivanieStore.itemsList = r;
                  props.navigation.navigate('ItemsListPerepalech');
                })
                .catch(e => {
                  alertActions(e);
                });
            }}
          />
        </View>
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

export default connect(mapStateToProps, {})(SpecifyPalletsScreens);

const styles = StyleSheet.create({
  titleStyle: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
