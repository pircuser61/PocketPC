import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import { Divider } from 'react-native-paper';

const TextFullInfoComponent = ({title, value}) => {
  
  return (
      <>
    <View style={styles.container}>
      <Text style={styles.title}>{title}: </Text>
      <Text style={styles.value}>{value?value:'-'}</Text>
    </View>
    <Divider/>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    width:'100%',
   // alignItems:'center',
    justifyContent:'space-between'
  },
  title: {
    marginLeft: 16,
    marginVertical: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  value: {
    marginHorizontal: 16,
    marginVertical: 8,
    fontSize: 16,
    maxWidth:200,
    textAlign:'right'
  },
});

export default TextFullInfoComponent;

/**
 * 
 * <Text
            style={[{fontSize: 18, alignSelf: 'center', marginVertical: 8}]}>
            Подробнее о товаре:
            
          </Text>
 *  <Text style={styles.formText1}>Артикул: {fullInfo.ArhKat.Artic}</Text>
      <Text style={styles.formText1}>Код фирмы: {fullInfo.ArhKat.CodFirm}</Text>
      <Text style={styles.formText1}>Мера измерения: {fullInfo.BarMeas}</Text>
      <Text style={styles.formText1}>KatMeas: {fullInfo.KatMeas}</Text>
      <Text style={styles.formText1}>KatName: {fullInfo.KatName}</Text>
      <Text style={styles.formText1}>ListUpak: {fullInfo.ListUpak}</Text>
      <Text style={styles.formText1}>MonthLife: {fullInfo.MonthLife}</Text>

  <TextFullInfoComponent title={'Артикул'} value={fullInfo.ArhKat.Artic}/>
      <TextFullInfoComponent title={'Наименование'} value={fullInfo.KatName}/>
      <TextFullInfoComponent title={'Код фирмы'} value={fullInfo.ArhKat.CodFirm}/>
      <TextFullInfoComponent title={'Мера измерения'} value={fullInfo.BarMeas}/>
      <TextFullInfoComponent title={'KatMeas'} value={fullInfo.KatMeas}/>
      <TextFullInfoComponent title={'ListUpak'} value={fullInfo.ListUpak}/>
      <TextFullInfoComponent title={'MonthLife'} value={fullInfo.MonthLife}/>
      
      
       {
           typeof fullInfo.ArhKat ==='object'?
           fullInfo.ArhKat.map((r,i)=>{
            return <View key={i.toString()}>
              <TextFullInfoComponent
            title={r.Artic}
            value={r.CodFirm}
          />
            </View>
           }):null
          }
      */
