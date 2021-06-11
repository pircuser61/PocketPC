import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {
  Caption,
  Card,
  Checkbox,
  Divider,
  Paragraph,
  Subheading,
  TouchableRipple,
} from 'react-native-paper';
import {connect} from 'react-redux';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {PocketListOb} from '../../../functions/PocketListOb';
import NakladNayaStore from '../../../mobx/NakladNayaStore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Title} from 'react-native-paper';
import {PocketPrPda1sOb} from '../../../functions/PocketPrPda1sOb';

const styles = StyleSheet.create({
  textTitle: {
    marginHorizontal: 28,
    marginTop: 16,
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 48,
  },
});

const Item = observer(({item, index}) => {
  const {cod_ob = [''], name = [''], checked = false, comment = ['']} = item;
  return (
    <TouchableOpacity
      style={{height: 60, flexDirection: 'row', alignItems: 'center'}}
      onPress={() => {
        NakladNayaStore.cityList[index].checked = !NakladNayaStore.cityList[
          index
        ].checked;
      }}>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          width: 100,
          textAlign: 'center',
          marginLeft: 16,
        }}>
        {name[0]}
      </Text>
      <Text
        style={{
          fontWeight: 'bold',
          marginLeft: 20,
          width: 180,
          textAlign: 'center',
        }}>
        {comment[0] !== '' ? comment[0] : '-----'}
      </Text>
      <View
        style={{
          width: 40,
          height: 40,
          //borderWidth: 0.3,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 4,
          marginLeft: 16,
          position: 'absolute',
          right: 16,
        }}
        onPress={() => {
          NakladNayaStore.cityList[index].checked = !NakladNayaStore.cityList[
            index
          ].checked;
        }}>
        {checked === true ? <Icon name={'check'} size={20} /> : <Text></Text>}
      </View>
    </TouchableOpacity>
  );
});

/**
 * {"checked": false, "cod_ob": ["100"], "comment": [""], "join_group": ["1"], "name": ["M1"], "order": ["1001"]}
 */

const ChooseOBScreen = observer(({navigation, user}) => {
  const renderItem = ({item, index}) => <Item item={item} index={index} />;

  const updateList = () => {
    NakladNayaStore.loading = true;
    PocketListOb(user.user.TokenData[0].$.UserUID, user.user.$['city.cod'])
      .then(list => {
        if (list.ListOb) {
          NakladNayaStore.cityList = list.ListOb[0].ListObRow.sort(
            (a, b) => a.order[0] - b.order[0],
          ).map((r, index) => {
            return {
              ...r,
              checked: NakladNayaStore.nakladnayaInfo.ListOb[0].Ob.includes(
                r.cod_ob[0],
              ),
              id: index,
              palletNumber: '',
            };
          });
        }
        NakladNayaStore.loading = false;
      })
      .catch(e => {
        NakladNayaStore.loading = false;
        alert(e);
      });
  };

  useEffect(() => {
    updateList();

    return () => {
      NakladNayaStore.cityList = [];
    };
  }, []);
  return (
    <View style={{flex: 1}}>
      <HeaderPriemka navigation={navigation} title={'Выберите объединения'} />
      <Card>
        <Card.Title
          title={NakladNayaStore.nakladnayaInfo.numNakl}
          right={() => (
            <TouchableOpacity
              style={{position: 'absolute', right: 16}}
              onPress={() => {
                NakladNayaStore.cityList = NakladNayaStore.cityList.map(r => {
                  return {...r, checked: false};
                });
              }}>
              <Icon name="close" size={30} />
            </TouchableOpacity>
          )}
        />
        <View style={{marginHorizontal: 16, height: 60}}>
          <Text style={{fontSize: 14}}>
            {NakladNayaStore.cityList.filter(r => r.checked).length
              ? 'Выбранные магазины: ' +
                NakladNayaStore.cityList
                  .filter(r => r.checked)
                  .map(r => ' ' + r.name[0].toString() + '')
              : 'Магазины не выбраны'}
          </Text>
        </View>
      </Card>
      <Divider />
      <TouchableOpacity
        style={{height: 20, flexDirection: 'row', alignItems: 'center'}}
        onPress={() => {
          NakladNayaStore.cityList[index].checked = !NakladNayaStore.cityList[
            index
          ].checked;
        }}>
        <Text
          style={{
            fontSize: 10,
            fontWeight: 'bold',
            width: 100,
            textAlign: 'center',
            marginLeft: 16,
          }}>
          Название об-я
        </Text>
        <Text
          style={{
            fontWeight: 'bold',
            marginLeft: 20,
            fontSize: 10,
            width: 180,
            textAlign: 'center',
          }}>
          Город
        </Text>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 16,
            position: 'absolute',
            right: 16,
          }}>
          <Text style={{fontWeight: 'bold', fontSize: 10}}>Состояние</Text>
        </View>
      </TouchableOpacity>
      <Divider />
      <FlatList
        data={NakladNayaStore.cityList}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ItemSeparatorComponent={() => <Divider />}
        style={{marginBottom: 49}}
      />
      <TouchableOpacity
        style={{
          height: 48,
          justifyContent: 'center',
          zIndex: 100,
          backgroundColor: '#313C47',
          alignItems: 'center',
          position: 'absolute',
          bottom: 0,
          width: '100%',
        }}
        onPress={() => {
          NakladNayaStore.loading = true;
          PocketPrPda1sOb(
            NakladNayaStore.nakladnayaInfo.IdNum,
            NakladNayaStore.cityList,
            user.user.TokenData[0].$.UserUID,
            user.user.$['city.cod'],
          )
            .then(r => {
              NakladNayaStore.choosenCities = NakladNayaStore.cityList.filter(
                r => r.checked,
              );
              NakladNayaStore.loading = false;
              navigation.navigate('ScreenForWorkWithNakladStrih');
            })
            .catch(e => {
              NakladNayaStore.loading = false;

              alert(e);
            });
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
          Готово
        </Text>
      </TouchableOpacity>
    </View>
  );
});
const mapStateToProps = state => {
  return {
    user: state.user,
  };
};

export default connect(mapStateToProps)(ChooseOBScreen);
