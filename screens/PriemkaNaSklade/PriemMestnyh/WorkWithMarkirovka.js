import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Modal,
  StyleSheet,
  Pressable,
  Vibration,
  ActivityIndicator,
} from 'react-native';
import {Button, Divider} from 'react-native-paper';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import {MarkHonestList} from '../../../functions/MarkHonestListNew';
import {MarkHonestAdd} from '../../../functions/MarkHonestAddNew';
import PostavshikAndArticool from '../../../components/PechatKM/PostavshikAndArticool';
import {MarkHonestDel} from '../../../functions/MarkHonestDelNew';
import PriemMestnyhHook from '../../../customHooks/PriemMestnyhHook';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {toUTF8Array} from '../../../functions/checkTypes';
import {connect} from 'react-redux';
import {UpakovachniyKM} from '../../../functions/UpakovachniyKM';
import {AddMarkList} from '../../../functions/AddMarkList';
import {DOMParser, XMLSerializer} from 'xmldom';
var parseXML = require('xml-parse-from-string');

const WorkWithMarkirovka = ({navigation, route, user}) => {
  const [codeMarksList, changeCodeMarkList] = useState({
    $: {CodGood: '', IdNum: ''},
    Mark: [],
  });
  const _api = PriemMestnyhHook();
  const [loading, setLoading] = useState(false);
  const {barcode, setBarcode} = _api;
  useEffect(() => {
    //console.log(user.user.$['city.cod']);
    // let samp="010805193111113821z<NL!:t>'/(d&"
    //console.log(samp.replaceAll('>','&quot'));
    console.log(route.params);
  }, []);

  //numNakl, palletNumber, IdNum,gtin,serial,user.user.TokenData[0].$.UserUID,user.user.$['city.cod']

  const AddUpakKM = km => {
    setModalVisible(true);
    UpakovachniyKM(km)
      .then(r => {
        /**
         * route.params.ParentId,
            IdNum,
            'pr_pda2',
         */
        AddMarkList(
          route.params.ParentId,
          IdNum,
          'pr_pda2',
          r,
          user.user.TokenData[0].$.UserUID,
          user.user.$['city.cod'],
        )
          .then(r => {
            Vibration.vibrate(100);
            alert(r);
            UpdateFields();
          })
          .catch(e => {
            UpdateFields();
            setModalVisible(false);
            alert(e);
          });
      })
      .catch(e => {
        UpdateFields();

        setModalVisible(false);
        alert(e);
      });
  };

  const [modalVisible, setModalVisible] = useState(true);

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
            route.params.ParentId,
            IdNum,
            'pr_pda2',
            data,
            user.user.TokenData[0].$.UserUID,
            user.user.$['city.cod'],
          )
            .then(r => {
              setModalVisible(false);
              UpdateFields();
            })
            .catch(e => {
              alert(e);
              setModalVisible(false);
              UpdateFields();
            });
        }
      }
    }
  };

  const {numNakl, palletNumber, IdNum} = route.params;

  const UpdateFields = () => {
    setModalVisible(true);
    MarkHonestList(
      route.params.ParentId,
      IdNum,
      'pr_pda2',
      user.user.TokenData[0].$.UserUID,
      user.user.$['city.cod'],
    )
      .then(r => {
        setModalVisible(false);

        changeCodeMarkList({...codeMarksList, Mark: r.Mark});
        setBarcode({data: '', time: '', type: ''});
      })
      .catch(e => {
        alert(e);
        setModalVisible(false);
        setBarcode({data: '', time: '', type: ''});
      });
  };

  useEffect(() => {
    _obrabotkaDataMatrix(barcode);
  }, [barcode]);

  useEffect(() => {
    UpdateFields();
  }, []);

  /**
 * 
             <Button
              onPress={() => {
                MarkHonestAdd(numNakl, palletNumber, IdNum)
                  .then((r) => {
                    UpdateFields();
                  })
                  .catch((e) => {
                    alert(e);
                    UpdateFields();
                  });
              }}>
              Добавить код маркировки
            </Button>
 */

  return (
    <View style={{flex: 1}}>
      <HeaderPriemka
        title={'Сканирование кодов маркировки'}
        navigation={navigation}
      />

      <ScrollView>
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
            onPress={UpdateFields}
            style={{position: 'absolute', right: 0}}>
            <AntDesign name="reload1" size={20} color="black" />
          </TouchableOpacity>
        </View>
        <Divider />
        <Text style={{marginVertical: 8, marginHorizontal: 16, fontSize: 16}}>
          Сканировано:{' '}
          {typeof codeMarksList.Mark === 'object'
            ? codeMarksList.Mark.length
            : 0}{' '}
          из {route.params.qty ? route.params.qty : 0}
        </Text>
        <Divider />
        {codeMarksList.Mark.length ? (
          <>
            <PostavshikAndArticool first={'Gtin'} second={'Serial'} />
            {codeMarksList.Mark.map((r, i) => {
              if (i > 40) {
                return null;
              }
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => {
                    setModalVisible(true);
                    MarkHonestDel(
                      route.params.ParentId,
                      IdNum,
                      'pr_pda2',
                      r.$.MarkId,
                      user.user.TokenData[0].$.UserUID,
                      user.user.$['city.cod'],
                    )
                      .then(r => {
                        UpdateFields();
                        setModalVisible(false);
                      })
                      .catch(e => {
                        setModalVisible(false);
                        alert(e);
                        UpdateFields();
                      });
                  }}>
                  <PostavshikAndArticool first={r.$.GTIN} second={r.$.Serial} />
                </TouchableOpacity>
              );
            })}
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
        <Text></Text>
        <Text></Text>
        <Text></Text>
      </ScrollView>

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
          navigation.navigate('WorkWithItemsInPallete');
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
};
//"GTIN": "04665555255768", "MarkId": "5711956650", "Serial": "3fuy22MetrQEMz"

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
  };
};

export default connect(mapStateToProps)(WorkWithMarkirovka);

/**
 *   navigation.navigate('WorkWithMarkirovka',
              {numNakl:route.params.numNakl,
              palletNumber:route.params.palletNumber,

              IdNum:route.params.$.IdNum})

 <Button onPress={() => {
                MarkHonestAdd(numNakl, palletNumber, IdNum)
                    .then(r => {
                        UpdateFields()
                    })
                    .catch(e => {
                        alert(e)
                        UpdateFields()
                    })

            }}>Добавить код маркировки</Button>
              
            
            */
