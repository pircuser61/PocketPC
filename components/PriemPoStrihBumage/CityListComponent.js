import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, TextInput, KeyboardAvoidingView } from 'react-native'
import CityListPoStrih from '../../redux/PriemPoStrihBumage/CityListPoStrih'
import { observer } from 'mobx-react-lite';
import { Button, Divider } from 'react-native-paper';
import { Checkbox } from 'react-native-paper';
import { useRef } from 'react';
import PriemMestnyhHook from '../../customHooks/PriemMestnyhHook';
import { useEffect } from 'react';
import { useState } from 'react';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


const CityListComponent = observer(({ item = { title: '', checked: false }, index = '', needTextInput = false }) => {


  const _api = PriemMestnyhHook()
  const { barcode } = _api
  const [canScan, setCanScan] = useState(false)

  useEffect(() => {
    canScan ?
      barcode.data ?
        changePalletNumber(index, barcode.data)
        : null
      : null
  }, [barcode])

  const { title, checked, palleteName, } = item
  const { setKeyToObj, changePalletNumber } = CityListPoStrih
  const textInp = useRef()

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => {
        needTextInput ? textInp.current.focus() : setKeyToObj(index, true)
      }}>
        <View style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%'
        }}>
          {needTextInput ? null : <Checkbox status={checked ? 'checked' : 'unchecked'} color={'#313C47'} />}
          <Text style={{ fontSize: 18, color: 'black', fontWeight: 'bold' }}>{title}</Text>
          {needTextInput ? <TouchableOpacity onPress={()=>{
            changePalletNumber(index, '')
          }} style={{position:'absolute',right:0,padding:12,borderColor:'#f74940',borderWidth:1,borderRadius:8}}><MaterialCommunityIcons color={'#f74940'} name={'close'} size={26}/></TouchableOpacity>:null}
          {
            needTextInput ? <View style={{ position: 'absolute', right: 60 }}>
              <TextInput style={styles.input}
                onFocus={()=>{setCanScan(true)}}
                onEndEditing={()=>{setCanScan(false)}}
                ref={textInp}
                value={palleteName}
                onChangeText={(text) => {
                  changePalletNumber(index, text)
                }}
                placeholder={'Нажмите, сканируйте'}
                
              />
            </View> : null
          }
        </View>
      </TouchableOpacity>
      <Divider />

    </>
  )
})


const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    height: 68,
    marginHorizontal: 16
  },
  input: {
    height: 52,
    margin: 12,
    borderWidth: 1,
    width: 200,
    borderRadius:8,
  },
})

export default CityListComponent

