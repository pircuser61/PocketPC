import {observer} from 'mobx-react-lite';
import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, Alert} from 'react-native';
import TitleAndDiscribe from '../../components/GlobalProverka/TitleAndDiscribe';
import HeaderPriemka from '../../components/PriemkaNaSklade/Header';
import MenuListComponent from '../../components/SystemComponents/MenuListComponent';
import {alertActions} from '../../constants/funcrions';
import {PocketListPrinters} from '../../functions/PocketListPrinters';
import {PocketProvPrint} from '../../functions/PocketProvPrint';
import UserStore from '../../mobx/UserStore';

interface PrinterInterface {
  Name: string[];
  Room: string[];
  Type: string[];
}

const PrintCheckScreen = observer((props: any) => {
  const [printerList, setprinterList] = useState<PrinterInterface[]>([]);
  const [currentPrinter, setcurrentPrinter] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const printCheck = async () => {
    try {
      const response = await PocketProvPrint({
        City: UserStore.user?.['city.cod'],
        UID: UserStore.user?.UserUID,
        Printer: currentPrinter ?? '',
        NumNakl: props.route?.params?.item?.ID,
      });
      Alert.alert('Успешно!', 'Этикетка распечатана', [
        {style: 'default', text: 'OK', onPress: () => {}},
      ]);
    } catch (error) {
      console.log(error);
    }
  };

  const getPrinter = async () => {
    try {
      setLoading(true);
      const response = await PocketListPrinters(
        UserStore.user?.deviceName,
        UserStore.user?.['city.cod'],
      );
      setprinterList(response);
    } catch (error) {
      alertActions(error + '');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPrinter();
  }, []);
  return (
    <View style={{flex: 1}}>
      <HeaderPriemka {...props} arrow={true} title={'Печать этикетку'} />
      <ScrollView style={{padding: 16}}>
        <TitleAndDiscribe
          title={'Имя устройства'}
          discribe={UserStore.user?.deviceName}
        />
        <TitleAndDiscribe
          title={'ID'}
          discribe={props.route?.params?.item?.ID}
        />
        <TitleAndDiscribe
          title={'Статус'}
          discribe={props.route?.params?.item?.Flag}
        />
        <TitleAndDiscribe
          title={'Подразделение'}
          discribe={props.route?.params?.item?.CodShop}
        />
        <Text>
          {props.route?.params?.item?.Comment
            ? props.route?.params?.item?.Comment
            : '---'}
        </Text>
        <TitleAndDiscribe title={'Выберите принтер'} discribe={' '} />
        {printerList.map((r, i) => {
          return (
            <View key={i} style={{paddingVertical: 16}}>
              <MenuListComponent
                data={[
                  {
                    title: r.Name[0],
                    action: () => {
                      setcurrentPrinter(r.Name[0]);
                    },
                  },
                ]}
              />
            </View>
          );
        })}
        {currentPrinter ? (
          <>
            <TitleAndDiscribe
              title={'Выбран принтер'}
              discribe={currentPrinter ?? '---'}
            />
            <View style={{paddingVertical: 16}}>
              <MenuListComponent
                data={[
                  {
                    title: 'Печать',
                    action: () => {
                      printCheck();
                    },
                  },
                ]}
              />
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
});

export default PrintCheckScreen;

const styles = StyleSheet.create({});
