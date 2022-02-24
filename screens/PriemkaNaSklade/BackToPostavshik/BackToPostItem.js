import {observer} from 'mobx-react-lite';
import React from 'react';
import {useState} from 'react';
import {useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {MarkHonestSpecsKm} from '../../../functions/MarkHonestSpecsKm';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Divider} from 'react-native-paper';
import {MarkHonestSpecsKmAdd} from '../../../functions/MarkHonestSpecsKmAdd';
import PostavshikAndArticool from '../../../components/PechatKM/PostavshikAndArticool';
import {MarkHonestDel} from '../../../functions/MarkHonestDel';
import ButtonBot from '../../../components/PriemkaNaSklade/ButtonBot';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {toUTF8Array} from '../../../functions/checkTypes';
import {alertActions, ViewTypes} from '../../../constants/funcrions';
import BackToPostavshikStore from '../../../mobx/BackToPostavshikStore';

const BackToPostItem = observer(props => {
  const {user, navigation, route} = props;

  const {
    CodGood = '',
    GoodQty = '',
    MarkQty = '',
    Name = '',
    SpecsId = '',
    WoMarkQty = '',
  } = route.params.data.$;

  let mounted = true;
  const [list, setList] = useState([]);
  const [refreshing, setRefreshing] = React.useState(true);

  let {width} = Dimensions.get('window');
  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(list.map((r, i) => ({...r, id: i + 1})));

  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;

  useEffect(() => {
    if (barcode.data.length > 0) {
      _obrabotkaDataMatrix(barcode);
    }
  }, [barcode]);

  const _obrabotkaDataMatrix = datamatrix => {
    const {data = '', type = '', time = ''} = datamatrix;
    if (typeof data === 'string' && data.length > 0) {
      if (type === 'LABEL-TYPE-CODE128' || type === 'LABEL-TYPE-EAN128') {
        // if (
        //   (data.slice(0, 2) === '00' ||
        //     (data.slice(1, 3) === '00' &&
        //       data[0] === '(' &&
        //       data[3] === ')')) &&
        //   data.length >= 18
        // ) {
        //   //AddUpakKM(data.replace(/\D+/g, '').replace(/^.{2}/, ''));
        // }

        alert(
          `Сканирование упаковочного кода для возврата поставщикам нет!\n\nСканировано: ${data}`,
        );
      } else if (type === 'LABEL-TYPE-DATAMATRIX') {
        if (
          data.slice(0, 2) === '01' &&
          data.slice(16, 18) === '21' &&
          toUTF8Array(data[31]) == 29
        ) {
          console.log(data);

          // console.log(data.slice(0,31));
          // let gtin = data.slice(2, 16);
          // let serial = data.slice(18, 31);
          setRefreshing(true);

          MarkHonestSpecsKmAdd(
            SpecsId,
            data,
            'vozp',
            BackToPostavshikStore.documentNumber,
            user.user.TokenData[0].$.UserUID,
            user.user.$['city.cod'],
          )
            .then(r => {
              getItemMarksList();
              setBarcode({data: '', time: '', type: ''});
            })
            .catch(e => {
              alertActions(e);
              getItemMarksList();
            });
        } else
          alert(
            `Код маркировки не удовлетворяет условиям!\n\nСканировано: ${data}`,
          );
      } else {
        alert(`Неподходящий тип баркода: ${type}\n\nСканировано: ${data}`);
      }
    }
  };

  function _rowRenderer(type, data) {
    //You can return any view here, CellContainer has no special significance
    switch (type) {
      case ViewTypes.FULL:
        return (
          <TouchableOpacity
            style={{height: 40, justifyContent: 'center', alignItems: 'center'}}
            onPress={() => {
              setRefreshing(true);

              MarkHonestDel(
                SpecsId,
                data.$.MarkId,
                'vozp2',
                user.user.TokenData[0].$.UserUID,
                user.user.$['city.cod'],
              )
                .then(r => {
                  getItemMarksList();
                })
                .catch(e => {
                  alertActions(e);
                  getItemMarksList();
                });
            }}>
            <PostavshikAndArticool first={data.$.GTIN} second={data.$.Serial} />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  }

  const onRefresh = React.useCallback(() => {
    getItemMarksList();
  }, []);

  const _layoutProvider = new LayoutProvider(
    index => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.FULL:
          dim.width = width;
          dim.height = 39;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  const getItemMarksList = () => {
    setRefreshing(true);

    MarkHonestSpecsKm(
      SpecsId,
      'vozp2',
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        setRefreshing(false);
        if (mounted) {
          setList(r);
        }
      })
      .catch(e => {
        setRefreshing(false);
        alertActions(e);
        navigation.goBack();
      });
  };

  useEffect(() => {
    getItemMarksList();
    return () => {
      setBarcode({data: '', time: '', type: ''});
      mounted = false;
    };
  }, []);

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka {...props} title={'КМ в возврате поставщику'} />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 0,
          marginVertical: 8,
          marginHorizontal: 16,
        }}>
        <AntDesign
          name="exclamationcircleo"
          size={20}
          color="black"
          style={{}}
        />
        <Text style={{marginLeft: 16, maxWidth: '80%'}}>
          Для удаления кодов маркировки нажмите на соответствующий Gtin и Serial
        </Text>
        <TouchableOpacity
          disabled={refreshing}
          onPress={getItemMarksList}
          style={{position: 'absolute', right: 0}}>
          <AntDesign name="reload1" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <Divider />
      <Text style={{marginVertical: 8, marginHorizontal: 16, fontSize: 16}}>
        Сканировано: {list.length} из {GoodQty ? GoodQty : 0}
      </Text>
      <Divider />
      {refreshing ? (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: 48,
          }}>
          <ActivityIndicator size={'large'} color={'black'} />
        </View>
      ) : list.length ? (
        <>
          <PostavshikAndArticool first={'Gtin'} second={'Serial'} height={48} />

          <RecyclerListView
            style={{marginBottom: 48}}
            layoutProvider={_layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={_rowRenderer}
            scrollViewProps={{
              refreshing: refreshing,
              refreshControl: (
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              ),
            }}
          />
        </>
      ) : (
        <View>
          <Image
            source={require('../../../assets/datamatrix.png')}
            style={{
              width: 100,
              height: 100,
              alignSelf: 'center',
              opacity: 0.6,
              marginTop: 100,
            }}
          />
          <Text
            style={{
              fontSize: 18,
              marginVertical: 8,
              textAlign: 'center',
              opacity: 0.6,
            }}>
            Cканируйте код маркировки
          </Text>
        </View>
      )}
      <ButtonBot
        title={'Готово'}
        disabled={false}
        onPress={() => {
          navigation.goBack();
        }}
      />
    </View>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(BackToPostItem);

const styles = StyleSheet.create({});
