import {observer} from 'mobx-react-lite';
import React from 'react';
import {View, Text, Pressable, TouchableOpacity} from 'react-native';
import {Divider} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import PerepalechivanieStore from '../../mobx/PerepalechivanieStore';
const ListItemComponent = observer(props => {
  const {
    data = {$: {CodGood: '', NumMax: '', Qty: '', NumPalTo: ''}},
    onPress = () => {},
  } = props;
  const getShopName = (sas, namemaxidom) => {
    return sas.filter(r => r.palletNumber === namemaxidom)[0]?.$.CodShop;
  };

  return (
    <>
      <TouchableOpacity
        onPress={onPress}
        style={{
          height: 79,
          justifyContent: 'center',
          //borderBottomWidth: 1,
          borderBottomColor: 'grey',
        }}>
        <View
          style={{
            //height: 78,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            //margin: 16,
            margin: 16,
          }}>
          <Text style={{width: 40, textAlign: 'center'}}>
            М-{data.$.NumMax}
          </Text>
          <Text style={{width: 30, textAlign: 'center'}}>
            {getShopName(PerepalechivanieStore.palletsList, data.$.NumPalTo)}
          </Text>
          <Text
            style={{
              //fontWeight: 'bold',
              width: 120,
              textAlign: 'center',
              //ackgroundColor: 'red',
            }}>
            {data.$.CodGood}
          </Text>
          <Text
            style={{
              //fontWeight: 'bold',
              width: 80,
              textAlign: 'center',
              //backgroundColor: 'red',
            }}>
            {data.$.NumPalTo}
          </Text>
          <Text
            style={{
              //fontWeight: 'bold',
              width: 60,
              textAlign: 'center',
              //backgroundColor: 'red',
            }}>
            {data.$.Qty}
          </Text>
        </View>
        <MaterialCommunityIcons
          name={'chevron-right'}
          size={10}
          style={{position: 'absolute', right: 8}}
        />
      </TouchableOpacity>
      <Divider />
    </>
  );
});

export default ListItemComponent;
