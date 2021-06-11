import React from 'react';
import {View, Text, Image} from 'react-native';

const GoodInfo = ({barcodeInfo}) => {
  
  return (
    <View style={{backgroundColor:'white',backgroundColor:'green',height:108,width:'100%',borderRadius:8,marginTop:20}}>
          <View style={{backgroundColor:'white',height:100,width:'100%',justifyContent:'center',borderRadius:8,flexDirection:'row',alignItems:'center'}}>

        <View style={{margin: 20}}>
          {barcodeInfo ? (
            <>
              <Text style={{fontSize:16}}><Text style={{fontWeight:'bold'}}>Код товара: </Text>{barcodeInfo['CodGood']}</Text>
              <Text style={{fontSize:16,}} numberOfLines={3}><Text style={{fontWeight:'bold'}}>Наименование: </Text>{barcodeInfo['Name']}</Text>
            </>
          ) : (
            null
          )}
        </View>
      </View>
    </View>
  );
};

export default GoodInfo;
