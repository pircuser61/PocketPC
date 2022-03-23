//m-prog13 прием передаточной накладной
import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import ScreenTemplate from '../../components/SystemComponents/ScreenTemplate';
import LoadingModalComponent from '../../components/SystemComponents/LoadingModalComponent';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import ScanInput from '../../components/SystemComponents/SimpleScanInput';
import {alertError} from '../../constants/funcrions';
import request from '../../soap-client/pocketRequest';
import useScanner from '../../customHooks/simpleScanHook';
import {Text} from 'react-native-paper';
import {FlatList} from 'react-native-gesture-handler';
import UserStore from '../../mobx/UserStore';

interface IBarCod {
  BarCod?: string;
  Quant?: string;
  CodLevel?: string;
  MeasName?: string;
  Price?: string;
  OnCass?: string;
  CodShop?: string;
}

interface IProp {
  Id?: string;
  Value?: string;
  Title?: string;
  Order?: string;
}

interface IPalett {
  NumPal?: string;
}

interface IShop {
  CodShop?: string;
}

interface IPlan {
  Place?: string;
}

interface IBarInfo {
  BarCod?: string;
  CodGood?: string;
  Name?: string;
  MeasName?: string;
  WFlag?: string;
  Quant?: string;
  Price?: string;
  Path?: string;
  Barcods?: {BarcodsRow: IBarCod[]};
  Props?: {PropsRow: IProp[]};
  Paletts?: {PalettsRow: IPalett[]};
  Plan?: {PlanRow: IPlan[]};
  Shops?: {ShopsRow: IShop[]; Error: string};
}

enum ViewMode {
  info,
  barcod,
  props,
  paletts,
  shops,
  plan,
}

const BarcodInfoEx = (props: any) => {
  // const [barCod, setInputValue] = useState('4601819507436');
  const [barCod, setInputValue] = useState('8716128567500');
  const [loading, setloading] = useState(false);
  const [viewMode, setViewMode] = useState(ViewMode.info);
  const [barInfo, setBarInfo] = useState<IBarInfo | null>(null);

  let isMounted = true;
  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);

  useScanner(setInputValue);

  const nextView = () => {
    setViewMode((viewMode + 1) % 6);
  };
  const prevView = () => {
    setViewMode((viewMode + 5) % 6);
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

      console.log('result');
      console.log(result);

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
      return BarcodsView(barInfo.Barcods?.BarcodsRow);
      break;
    case ViewMode.props:
      return PropsView(barInfo.Props?.PropsRow);
      break;
    case ViewMode.paletts:
      return PalettsView(barInfo.Paletts?.PalettsRow);
      break;
    case ViewMode.shops:
      return ShopsView(barInfo.Shops?.ShopsRow, barInfo.Shops?.Error);
      break;
    case ViewMode.plan:
      return PlanView(barInfo.Plan?.PlanRow);
      break;
    default:
      return InfoView(barInfo);
  }
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row'},
  col1: {flex: 4},
  col2: {flex: 1.8},
  col3: {flex: 2},
  colItem: {fontSize: 18},

  listItem: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },

  barTextStyle: {marginLeft: 4, fontSize: 20},
});

const InfoView = (info: IBarInfo) => {
  return (
    <View>
      <View style={styles.row}>
        <Text>Код товара</Text>
        <Text>{info.CodGood}</Text>
      </View>
      <View style={styles.row}>
        <Text></Text>
        <Text>{info.Name}</Text>
      </View>
      <View style={styles.row}>
        <Text></Text>
        <Text>{info.Path}</Text>
      </View>
      <View style={styles.row}>
        <Text>Базовый коэф.</Text>
        <Text>{info.Quant}</Text>
      </View>
      <View style={styles.row}>
        <Text>Базовая цена</Text>
        <Text>{info.Price}</Text>
      </View>
      <View style={styles.row}>
        <Text>Товар мерный</Text>
        <Text>{info.WFlag}</Text>
      </View>
      <View style={styles.row}>
        <Text></Text>
        <Text>{}</Text>
      </View>
    </View>
  );
};

const BarcodsView = (barcods?: IBarCod[]) => {
  const rni = ({item}: {item: any}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.barTextStyle}>{item.BarCod}</Text>
          <Text style={styles.barTextStyle}>{item.MeasName}</Text>
          <Text style={styles.barTextStyle}>{item.Quant}</Text>
          <Text style={styles.barTextStyle}>{item.CodLevel}</Text>
          <Text style={styles.barTextStyle}>{item.OnCass}</Text>
          <Text style={styles.barTextStyle}>{item.Price}</Text>
          <Text style={styles.barTextStyle}>{item.Price}</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Text>Ед.изм.:</Text>
          <Text style={styles.barTextStyle}>{item.MeasName}</Text>
          <Text>На кассе:</Text>
          <Text style={styles.barTextStyle}>{item.OnCass}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <View style={{flexDirection: 'row'}}>
        <Text style={{margin: 4, fontSize: 20}}> Баркод </Text>
        <Text style={{margin: 4, fontSize: 20}}> Изм. </Text>
        <Text style={styles.barTextStyle}>Кол-во</Text>
        <Text style={styles.barTextStyle}>Т.ц.</Text>
        <Text style={styles.barTextStyle}>В кассе</Text>

        <Text style={styles.barTextStyle}>Цена</Text>
        <Text style={styles.barTextStyle}>Стоимость</Text>
      </View>
      {barcods ? (
        <FlatList
          data={barcods}
          renderItem={rni}
          keyExtractor={item => item.BarCod}
        />
      ) : (
        <Text>нет данных</Text>
      )}
    </>
  );
};

const PropsView = (barProps?: IProp[]) => {
  const rni = ({item}: {item: any}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.barTextStyle}>{item.Title}</Text>
          <Text style={styles.barTextStyle}>{item.Value}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Text>Свойства</Text>
      {barProps ? (
        <FlatList
          data={barProps}
          renderItem={rni}
          keyExtractor={item => item.Id}
        />
      ) : (
        <Text>нет данных</Text>
      )}
    </>
  );
};

const PalettsView = (paletts?: IPalett[]) => {
  const rni = ({item}: {item: any}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.barTextStyle}>{item.NumPal}</Text>
          <Text style={styles.barTextStyle}>{item.Qty}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Text>Палетты</Text>
      {paletts ? (
        <FlatList
          data={paletts}
          renderItem={rni}
          keyExtractor={item => item.NumPal}
        />
      ) : (
        <Text>нет данных</Text>
      )}
    </>
  );
};

const ShopsView = (barProps?: IShop[], error?: string) => {
  const rni = ({item}: {item: any}) => {
    return (
      <View style={styles.listItem}>
        <View style={{flexDirection: 'row'}}>
          <Text style={styles.barTextStyle}>{item.CodShop}</Text>
          <Text style={styles.barTextStyle}>{item.Qty}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      <Text>Остатки</Text>
      {error ? (
        <Text>{error}</Text>
      ) : barProps ? (
        <FlatList
          data={barProps}
          renderItem={rni}
          keyExtractor={item => item.CodShop}
        />
      ) : (
        <Text>нет данных</Text>
      )}
    </>
  );
};
const PlanView = (plan?: IPlan[]) => {
  return <Text>Plan</Text>;
};

export default BarcodInfoEx;
