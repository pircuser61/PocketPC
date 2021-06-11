import React, {useState, useEffect} from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  DeviceEventEmitter,
  TouchableWithoutFeedback,
  Keyboard,
  StyleSheet,
  ScrollView,
  Dimensions,
  Modal,
  Pressable,
  Vibration,
} from 'react-native';
import HeaderPriemka from '../../../components/PriemkaNaSklade/Header';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DataWedgeIntents from 'react-native-datawedge-intents';
import 'react-native-gesture-handler';
import {enableScreens} from 'react-native-screens';
import {PocketPrPda2} from '../../../functions/PocketPrPda2';
import {connect} from 'react-redux';
import {setPalletsListInPriemMestnyhTHUNK} from '../../../redux/reducer';
import {useFocusEffect} from '@react-navigation/native';
import {PocketBarcodInfo} from '../../../functions/PocketBarcodInfo';
import {PocketPrBarInfo} from '../../../functions/PocketPrBarInfo';
import {Divider} from 'react-native-paper';
import TextFullInfoComponent from '../../../components/PriemkaNaSklade/PriemMestnyh/TextFullInfoComponent';

import {PocketPrPda2Save} from '../../../functions/PocketPrPda2Save';
import PostavshikAndArticool from '../../../components/PechatKM/PostavshikAndArticool';
import RNBeep from 'react-native-a-beep';

const ModalChooseNN = ({modalVisible, setModalVisible,listNN,setNN}) => {
  let mounted=true
 useEffect(()=>{
   if(listNN.lenght>1)
   {
    Vibration.vibrate(400);
    RNBeep.beep(false)
   }
 },[listNN])

 useEffect(()=>{
  return ()=>{
    mounted=false
  }
 },[])
 
  return (
     <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
         
          setModalVisible(!modalVisible);
        }}
      >
         <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.6)'}}>
          <View style={styles.modalView}>
              <ScrollView style={{maxHeight:250}}>
              <Text style={{fontWeight:'bold',fontSize:16,alignSelf:'center'}}>Выберете NN:</Text>
            {
                listNN.map((r,i)=>{
                    console.log('!!!'+r);
                    return <TouchableOpacity
                    onPress={()=>{
                        setNN(r)
                        setModalVisible(false)
                    }}
                    key={i} style={{padding:20,margin:8,alignItems:'center',justifyContent:'center',width:200,backgroundColor:'grey',borderRadius:8}}>
                        <Text >{r}</Text>
                        </TouchableOpacity>
                })
            }
              </ScrollView>
           
          </View>
        </View>
      </Modal>
   
  );
};

const styles = StyleSheet.create({

  modalView: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
 
});

export default ModalChooseNN
