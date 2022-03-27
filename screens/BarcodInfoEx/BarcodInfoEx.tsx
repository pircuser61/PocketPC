//m-prog13 прием передаточной накладной
import React, {useEffect, useState} from 'react';
import {Text, StyleSheet, View} from 'react-native';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import ScanInput from '../../components/SystemComponents/SimpleScanInput';
import {alertError} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import useScanner from '../../customHooks/simpleScanHook';
import {FlatList} from 'react-native-gesture-handler';
import UserStore from '../../mobx/UserStore';

interface IBarCod {
  BarCod: string;
  Quant: string;
  CodLevel: string;
  MeasName: string;
  Price: string;
  OnCass: string;
  CodShop: string;
  TotalPrice: string;
}

interface IProp {
  Id: string;
  Value: string;
  Title: string;
  Order: string;
}

interface IPalett {
  NumPal: string;
  Qty: string;
  Date: string;
  Deleted: string;
  Comment: string;
  Place: {
    Rack: string;
    Floor: string;
    Place: string;
  };
}

interface IShop {
  CodShop: string;
  Qty: string;
  QtyRez: string;
  Order: number;
}

interface IBarInfo {
  BarCod: string;
  CodGood: string;
  Artic: string;
  Name: string;
  MeasName: string;
  WFlag: string;
  Price: string;
  Path: string;
  PathRoot: string;
  Barcods?: {BarcodsRow: IBarCod[]};
  Props?: {PropsRow: IProp[]};
  Paletts?: {PalettsRow: IPalett[]};
  Shops?: {ShopsRow: IShop[]};
}

enum ViewMode {
  info,
  barcod,
  props,
  paletts,
  shops,
}
/*
let tm = Date.now();
*/
const BarcodInfoEx = (props: any) => {
  // const [barCod, setInputValue] = useState('4601819507436');
  //const [barCod, setInputValue] = useState('8716128567500');
  const [barCod, setInputValue] = useState('1000041156');
  const [loading, setloading] = useState(false);
  const [viewMode, setViewMode] = useState(ViewMode.info);
  const [barInfo, setBarInfo] = useState<IBarInfo | null>(null);

  let isMounted = true;
  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);
  /*
  useEffect(() => {
    console.log(Date.now() - tm);
  }, [viewMode]);
*/
  useScanner(setInputValue);

  const nextView = () => {
    /*
    console.log('VIEWMODE' + ((viewMode + 1) % 5));
    tm = Date.now();
*/
    setViewMode((viewMode + 1) % 5);
  };
  const prevView = () => {
    /*
    console.log('VIEWMODE' + ((viewMode + 4) % 5));
    tm = Date.now();
*/
    setViewMode((viewMode + 4) % 5);
  };

  const find = async () => {
    try {
      if (!isMounted) return;
      setloading(true);
      const result = (await request(
        'BarcodInfoEx',
        {barCod, CodShop: UserStore.podrazd.Id},
        {
          arrayAccessFormPaths: [
            'BarcodInfoEx.Barcods.BarcodsRow',
            'BarcodInfoEx.Props.PropsRow',
            'BarcodInfoEx.Paletts.PalettsRow',
            'BarcodInfoEx.Plan.PlanRow',
            'BarcodInfoEx.Shops.ShopsRow',
          ],
        },
      )) as IBarInfo;

      if (isMounted) setBarInfo(result);
    } catch (error) {
      if (isMounted) {
        alertError(error);
        setBarInfo(null);
      }
    } finally {
      setloading(false);
    }
  };

  return (
    <ScreenTemplate {...props} title={'Информация о товаре'}>
      <View style={{marginLeft: 10, marginRight: 10}}>
        <ScanInput
          placeholder="Введите баркод"
          value={barCod}
          onSubmit={find}
          setValue={setInputValue}></ScanInput>
      </View>
      <View
        style={{
          flex: 1,
          borderBottomWidth: 1,
          paddingLeft: 10,
        }}>
        <DisplayInfo viewMode={viewMode} barInfo={barInfo} />
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          paddingLeft: 10,
          paddingBottom: 10,
          paddingRight: 10,
        }}>
        <SimpleButton text="< " onPress={prevView} />
        <SimpleButton text="Найти " onPress={find} />
        <SimpleButton text="> " onPress={nextView} />
      </View>
      <LoadingModalComponent modalVisible={loading} />
    </ScreenTemplate>
  );
};

const DisplayInfo = ({
  barInfo,
  viewMode,
}: {
  barInfo: IBarInfo | null;
  viewMode: ViewMode;
}) => {
  if (barInfo === null) return <Text>Нет данных</Text>;

  switch (viewMode) {
    case ViewMode.barcod:
      return <BarcodsView barcods={barInfo.Barcods?.BarcodsRow} />;
    case ViewMode.props:
      return <PropsView barProps={barInfo.Props?.PropsRow} />;
    case ViewMode.paletts:
      return <PalettsView paletts={barInfo.Paletts?.PalettsRow} />;
    case ViewMode.shops:
      return <ShopsView shops={barInfo.Shops?.ShopsRow} />;
    default:
      return <InfoView info={barInfo} />;
  }
};

const InfoView = ({info}: {info: IBarInfo}) => {
  return (
    <View>
      <TextLine label={'Код товара:'} text={info.CodGood} />
      <TextLine label={'Артикул:'} text={info.Artic} />
      <TextLine text={info.Name} />
      <TextLine label={info.PathRoot} />
      <Text style={styles.text}> {info.Path}</Text>
      <TextLine label={'Базовая цена:'} text={info.Price} />
      <TextLine
        label={'Товар мерный:'}
        text={info.WFlag === 'true' ? 'Да' : 'Нет'}
      />
    </View>
  );
};

const renderBarcodsRow = ({item}: {item: IBarCod}) => {
  return (
    <View style={styles.tableRowContainer}>
      <View style={{flexDirection: 'row'}}>
        <Col1 val={item.BarCod} flex={3} textAlign="left" />
        <Col1 val={item.MeasName} flex={1} />
        <Col1 val={item.Quant} flex={1.5} />
        <Col1 val={item.CodLevel} flex={1} />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Col2 label="Цена:" text={item.Price} flex={2} />
        <Col2 label="Стоимость:" text={item.TotalPrice} flex={3} />
        <Col2
          label="В кассе:"
          text={item.OnCass === 'true' ? 'есть' : 'НЕТ!'}
          flex={2}
        />
      </View>
    </View>
  );
};

const BarcodsView = ({barcods}: {barcods?: IBarCod[]}) => {
  return (
    <>
      <Text style={styles.header}>Баркоды</Text>
      <View style={styles.teableHeader}>
        <Col1 val="Баркод" flex={3} />
        <Col1 val="Изм." flex={1} />
        <Col1 val="Кол-во" flex={1.5} />
        <Col1 val="Т.ц." flex={1} />
      </View>

      {barcods ? (
        <FlatList
          data={barcods}
          renderItem={renderBarcodsRow}
          keyExtractor={item => item.BarCod}
        />
      ) : (
        <Text>нет данных</Text>
      )}
    </>
  );
};

const renderPropsRow = ({item}: {item: IProp}) => (
  <TextLine label={item.Title + ':'} text={item.Value} />
);

const PropsView = ({barProps}: {barProps?: IProp[]}) => {
  return (
    <>
      <Text style={styles.header}>Свойства</Text>
      {barProps ? (
        <FlatList
          data={barProps}
          renderItem={renderPropsRow}
          keyExtractor={item => item.Id}
        />
      ) : (
        <Text>нет данных</Text>
      )}
    </>
  );
};

const renderPalettsRow = ({item}: {item: IPalett}) => (
  <View style={styles.tableRowContainer}>
    <View style={{flexDirection: 'row'}}>
      <Col1 val={item.NumPal} textAlign="left" />
      <Col1 val={item.Qty} />
      <Col1 val={item.Deleted === 'true' ? 'да' : 'нет'} />
      <Col1 val={item.Date} />
    </View>
    <View style={{flexDirection: 'row'}}>
      <Col2 label="Стеллаж:" text={item.Place?.Rack} flex={1} />
      <Col2 label="Этаж:" text={item.Place?.Floor} flex={1} />
      <Col2 label="Место:" text={item.Place?.Place} flex={1} />
    </View>
    <View>
      <Text>{item.Comment}</Text>
    </View>
  </View>
);

const PalettsView = ({paletts}: {paletts?: IPalett[]}) => {
  return (
    <>
      <Text style={styles.header}>Палетты</Text>
      <View style={styles.teableHeader}>
        <Col1 val="Палетт" />
        <Col1 val="Кол-во" />
        <Col1 val="Удалена" />
        <Col1 val="Дата" />
      </View>
      {paletts ? (
        <FlatList
          data={paletts}
          renderItem={renderPalettsRow}
          keyExtractor={item => item.NumPal}
        />
      ) : (
        <Text>нет данных</Text>
      )}
    </>
  );
};

const renderShopsRow = ({item}: {item: IShop}) => {
  return (
    <View style={styles.tableRowContainer}>
      <View style={{flexDirection: 'row'}}>
        <Col1 val={item.CodShop} flex={1} />
        <Col1 val={item.Qty} flex={1} />
        <Col1 val={item.QtyRez} flex={1} />
      </View>
    </View>
  );
};

const ShopsView = ({shops}: {shops?: IShop[]}) => {
  return (
    <>
      <Text style={styles.header}>Остатки</Text>
      <View style={styles.teableHeader}>
        <Col1 val="Подр." flex={1} />
        <Col1 val="Кол-во" flex={1} />
        <Col1 val="Резерв" flex={1} />
      </View>
      {shops ? (
        <FlatList
          data={shops}
          renderItem={renderShopsRow}
          keyExtractor={item => item.CodShop}
        />
      ) : (
        <Text>нет данных</Text>
      )}
    </>
  );
};

const TextLine = ({label, text}: {label?: string; text?: string}) => (
  <View style={{flexDirection: 'row', paddingTop: 6}}>
    {label ? <Text style={styles.labelText}>{label}</Text> : null}
    <Text style={styles.text}>{text}</Text>
  </View>
);

const Col1 = ({
  val,
  flex = 1,
  textAlign = 'center',
}: {
  val: string;
  flex?: number;
  textAlign?: 'center' | 'left';
}) => (
  <View style={{flex: flex}}>
    <Text style={[styles.text, {textAlign: textAlign}]}>{val}</Text>
  </View>
);

const Col2 = ({
  label,
  text,
  flex,
}: {
  label: string;
  text: string;
  flex: number;
}) => (
  <>
    <View style={{flex: flex, flexDirection: 'row'}}>
      <Text style={{fontWeight: 'bold', paddingRight: 4}}>{label}</Text>
      <Text style={{paddingRight: 4}}>{text}</Text>
    </View>
  </>
);

const styles = StyleSheet.create({
  header: {textAlign: 'center', fontSize: 20, fontWeight: 'bold'},
  teableHeader: {flexDirection: 'row', backgroundColor: '#D1D1D1'},
  labelText: {fontSize: 18, fontWeight: 'bold', paddingRight: 10},
  text: {fontSize: 18},

  tableRowContainer: {
    borderTopWidth: 0.3,
    marginVertical: 6,
  },
});

export default BarcodInfoEx;
