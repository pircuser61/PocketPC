/**
 *   <Button onPress={()=>{
        setBarcode({data:'(00)046200582401025715',time:'',type:'LABEL-TYPE-CODE128'})
      }}>setbrcd</Button>
 * import {observer} from 'mobx-react-lite';
import React from 'react';
import {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Image,
  Modal,
  StyleSheet,
  Vibration,
} from 'react-native';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {ActivityIndicator, Button, Divider} from 'react-native-paper';
import {RecyclerListView, DataProvider, LayoutProvider} from 'recyclerlistview';
import {MarkHonestList} from '../../../functions/MarkHonestListNew';
import {connect} from 'react-redux';
import NakladNayaStore from '../../../mobx/NakladNayaStore';
import {useState} from 'react/cjs/react.development';
import {MarkHonestAdd} from '../../../functions/MarkHonestAddNew';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import {toUTF8Array} from '../../../functions/checkTypes';
import PostavshikAndArticool from '../../../components/PechatKM/PostavshikAndArticool';
import {MarkHonestDel} from '../../../functions/MarkHonestDelNew';
import {UpakovachniyKM} from '../../../functions/UpakovachniyKM';
import {AddMarkList} from '../../../functions/AddMarkList';

const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

const WorkWithMarkirovkaStrihBumaga = observer(props => {
  const {route = {}, user, navigation} = props;
  const {params = {}} = route;
  const [list, setList] = useState([]);
  const [modalVisible, setModalVisible] = useState(true);

  const _api = PriemMestnyhHook();

  const {barcode} = _api;

  const updateList = () => {
    setModalVisible(true);

    MarkHonestList(
      NakladNayaStore.nakladnayaInfo.IdNum,
      IdNum,
      'pr_pda4',
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        setList(r.Mark);
        setModalVisible(false);
      })
      .catch(e => {
        alert(e);
        setModalVisible(false);
      });
  };

  const AddUpakKM = km => {
    setModalVisible(true);
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
            setModalVisible(false);
            alert(e);
          });
      })
      .catch(e => {
        UpdateList();

        setModalVisible(false);
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
          (data.slice(0, 2) === '01' &&
            data.slice(16, 18) === '21' &&
            (data.slice(32, 34) === '91' ||
              data.slice(32, 34) === '24' ||
              data.slice(32, 34) === '92') &&
            toUTF8Array(data[31]) == 29) ||
          (data.slice(0, 2) === '01' &&
            data.slice(16, 18) === '21' &&
            toUTF8Array(data[31]) == 29)
        ) {
          // console.log(data.slice(0,31));
          // let gtin = data.slice(2, 16);
          // let serial = data.slice(18, 31);

          setModalVisible(true);
          MarkHonestAdd(
            NakladNayaStore.nakladnayaInfo.IdNum,
            IdNum,
            'pr_pda4',
            data.slice(0, 31).replace(/&/g, '&amp;').replace(/</g, '&lt;'),
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
    _obrabotkaDataMatrix(barcode);
  }, [barcode]);

  const {IdNum = ''} = params;
  let dataProvider = new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(list);

  function _rowRenderer(type, r) {
    //You can return any view here, CellContainer has no special significance
    switch (type) {
      case ViewTypes.FULL:
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
  }

  let {width} = Dimensions.get('window');
  const _layoutProvider = new LayoutProvider(
    index => {
      return ViewTypes.FULL;
    },
    (type, dim) => {
      switch (type) {
        case ViewTypes.FULL:
          dim.width = width;
          dim.height = 40;
          break;
        default:
          dim.width = 0;
          dim.height = 0;
      }
    },
  );
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
          onPress={updateList}
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
      <Modal
        animationType="none"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
          navigation.goBack();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <ActivityIndicator size="large" color="#313C47" />
          </View>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginTop: 60,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

const mapStateToProps = state => {
  return {
    user: state.user,
    podrazd: state.podrazd,
  };
};

export default connect(mapStateToProps)(WorkWithMarkirovkaStrihBumaga);

/**
 *    <Button onPress={()=>{
        setBarcode({data:'(00)046200582401025715',time:'',type:'LABEL-TYPE-CODE128'})
      }}>setbrcd</Button> 
      
 */
