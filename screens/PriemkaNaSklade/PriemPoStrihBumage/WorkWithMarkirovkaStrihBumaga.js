import {observer} from 'mobx-react-lite';
import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import {connect} from 'react-redux';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import NakladNayaStore from '../../../mobx/NakladNayaStore';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {MarkHonestList} from '../../../functions/MarkHonestListNew';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {Button, Divider} from 'react-native-paper';
import PostavshikAndArticool from '../../../components/PechatKM/PostavshikAndArticool';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {MarkHonestDel} from '../../../functions/MarkHonestDelNew';
import {UpakovachniyKM} from '../../../functions/UpakovachniyKM';
import {AddMarkList} from '../../../functions/AddMarkList';
import {toUTF8Array} from '../../../functions/checkTypes';
import {MarkHonestAdd} from '../../../functions/MarkHonestAddNew';
import LoadingComponent from '../../../components/PriemPoStrihBumage/LoadingComponent';

const {width} = Dimensions.get('window');

const WorkWithMarkirovkaStrihBumaga = observer(props => {
  const {route, user, navigation} = props;
  const {params} = route;
  const [list, setList] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);
  const {IdNum = ''} = params;
  const [loading, setLoading] = useState(true);

  const _api = PriemMestnyhHook();
  const {barcode, setBarcode} = _api;

  const UpdateList = () => {
    setLoading(true);
    MarkHonestList(
      NakladNayaStore.nakladnayaInfo.IdNum,
      IdNum,
      'pr_pda4',
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        setList(r.Mark);
        setLoading(false);
      })
      .catch(e => {
        alert(e);
        setLoading(false);
      });
  };

  const _layoutProvider = new LayoutProvider(
    index => {
      return 0;
    },
    (type, dim) => {
      switch (type) {
        case 0:
          dim.width = width;
          dim.height = 40;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );

  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(list);

  const _rowRenderer = (type, r) => {
    switch (type) {
      case 0:
        return (
          <TouchableOpacity
            onPress={() => {
              MarkHonestDel(
                NakladNayaStore.nakladnayaInfo.IdNum,
                IdNum,
                'pr_pda4',
                r.$.MarkId,
                user.user.TokenData[0].$.UserUID,
                user.user.$['city.cod'],
              )
                .then(r => {
                  UpdateList();
                  console.log(r);
                })
                .catch(e => {
                  UpdateList();
                  console.log(e);
                });
            }}>
            <PostavshikAndArticool
              first={r.$.GTIN}
              second={r.$.Serial}
              height={40}
            />
          </TouchableOpacity>
        );
      default:
        return null;
    }
  };

  const AddUpakKM = km => {
    setLoading(true);
    UpakovachniyKM(km)
      .then(r => {
        AddMarkList(
          NakladNayaStore.nakladnayaInfo.IdNum,
          IdNum,
          'pr_pda4',
          r,
          user.user.TokenData[0].$.UserUID,
          user.user.$['city.cod'],
        )
          .then(r => {
            Vibration.vibrate(100);
            alert(r);
            UpdateList();
          })
          .catch(e => {
            UpdateList();
            alert(e);
          });
      })
      .catch(e => {
        UpdateList();

        alert(e);
      });
  };

  const _obrabotkaDataMatrix = datamatrix => {
    const {data = '', type = '', time = ''} = datamatrix;
    if (data) {
      if (type === 'LABEL-TYPE-CODE128') {
        if (
          (data.slice(0, 2) === '00' ||
            (data.slice(1, 3) === '00' &&
              data[0] === '(' &&
              data[3] === ')')) &&
          data.length >= 18
        ) {
          AddUpakKM(data.replace(/\D+/g, '').replace(/^.{2}/, ''));
        }
      }

      if (type === 'LABEL-TYPE-DATAMATRIX') {
        console.log(data);
        if (
          data.slice(0, 2) === '01' &&
          data.slice(16, 18) === '21' &&
          toUTF8Array(data[31]) == 29
        ) {
          // console.log(data.slice(0,31));
          // let gtin = data.slice(2, 16);
          // let serial = data.slice(18, 31);

          setModalVisible(true);
          MarkHonestAdd(
            NakladNayaStore.nakladnayaInfo.IdNum,
            IdNum,
            'pr_pda4',
            data,
            user.user.TokenData[0].$.UserUID,
            user.user.$['city.cod'],
          )
            .then(r => {
              setModalVisible(false);
              UpdateList();
            })
            .catch(e => {
              alert(e);
              setModalVisible(false);
              UpdateList();
            });
        }
      }
    }
  };

  useEffect(() => {
    barcode.data ? _obrabotkaDataMatrix(barcode) : null;
  }, [barcode]);

  useEffect(() => {
    UpdateList();
  }, []);

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka {...props} title={'Сканирование кодов маркировки'} />

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
          Для удаления кодов маркировки нажимите на соответствующий Gtin и
          Serial
        </Text>
        <TouchableOpacity
          onPress={() => {
            UpdateList();
          }}
          style={{position: 'absolute', right: 0}}>
          <AntDesign name="reload1" size={20} color="black" />
        </TouchableOpacity>
      </View>
      <Divider />
      <Text style={{marginVertical: 8, marginHorizontal: 16, fontSize: 16}}>
        Сканировано: {list.length ? list.length : 0} из{' '}
        {route.params.qty ? route.params.qty : 0}
      </Text>
      <Divider />

      {list.length ? (
        <>
          <PostavshikAndArticool first={'Gtin'} second={'Serial'} />

          <RecyclerListView
            style={{marginBottom: 48}}
            layoutProvider={_layoutProvider}
            dataProvider={dataProvider}
            rowRenderer={_rowRenderer}
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
          navigation.navigate('ItemStrihList');
        }}>
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 14}}>
          Готово
        </Text>
      </TouchableOpacity>
      {loading ? <LoadingComponent /> : null}
    </View>
  );
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(WorkWithMarkirovkaStrihBumaga);
