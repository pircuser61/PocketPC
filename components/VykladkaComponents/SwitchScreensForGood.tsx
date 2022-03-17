import React from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
import {BRIGHT_GREY, SCREEN_WIDTH} from '../../constants/funcrions';
import {
  GoodsRow,
  PalettRow,
  PlanRow,
  UcenRow,
} from '../../functions/PocketProvfreeGoods';
import TitleAndDiscribe from '../GlobalProverka/TitleAndDiscribe';
import SizedBox from '../SystemComponents/SizedBox';
import WhiteCardForInfo from '../SystemComponents/WhiteCardForInfo';

interface IProps {
  goodInfo: GoodsRow;
  index: number;
  listItems: number[];
}

const SwitchScreensForGood = (props: IProps) => {
  const {goodInfo, index} = props;

  const RenderItem = () => {
    switch (index) {
      case 0:
        return <GoodInfoScreen {...props} />;
        break;
      case 1:
        return <ShopRow {...props} />;
        break;
      case 2:
        return <PalletsRow {...props} />;
        break;
      case 3:
        return <Razmeshenie {...props} />;
        break;
      case 4:
        return <UcensRow {...props} />;
        break;
      case 5:
        return <BarcodesBox {...props} />;
        break;
      case 6:
        return <MoreInfoCell {...props} />;
        break;
      default:
        return <View />;
        break;
    }
  };

  const RenderText = () => {
    switch (index) {
      case 0:
        return 'Общая информация';
        break;
      case 1:
        return 'Подразделения';
        break;
      case 2:
        return 'Паллеты';
        break;
      case 3:
        return 'Размещение';
        break;
      case 4:
        return 'Уценка';
        break;
      case 5:
        return 'Баркоды';
        break;
      case 6:
        return 'Дополнительно';
        break;
      default:
        return '';
        break;
    }
  };

  return (
    <View style={{flex: 1, paddingHorizontal: 16, overflow: 'hidden'}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <Text style={{fontWeight: 'bold'}}>{RenderText()}</Text>
        <Text style={{fontWeight: 'bold', alignSelf: 'flex-end'}}>
          {index + 1}/{props.listItems.length}
        </Text>
      </View>

      <RenderItem />
    </View>
  );
};

export default SwitchScreensForGood;

const styles = StyleSheet.create({});

const GoodInfoScreen = ({goodInfo}: IProps) => {
  return (
    <View style={{flex: 1}}>
      <TitleAndDiscribe title="Артикул" discribe={goodInfo.KatArt} />
      <Text style={{fontSize: 16}}>{goodInfo.DepName}</Text>
      <Text style={{fontSize: 16}}>{goodInfo.KatName}</Text>
      <TitleAndDiscribe
        title="Цена"
        discribe={Number(goodInfo.Price).toFixed(2)}
      />
      <TitleAndDiscribe
        title="Последняя продажа"
        discribe={goodInfo.LastSale}
      />
      <TitleAndDiscribe title="Тип цены" discribe={goodInfo.TypeCen} />
    </View>
  );
};

const BarcodesBox = ({goodInfo}: {goodInfo: GoodsRow}) => {
  const renderItem = React.useCallback(({item}) => {
    return (
      <View style={{paddingHorizontal: 0, paddingVertical: 4}}>
        <WhiteCardForInfo
          style={{
            backgroundColor: BRIGHT_GREY,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              width: '50%',
              //backgroundColor: 'red'
            }}>
            {item.Cod}
          </Text>
          <Text
            style={{
              width: '20%',
              textAlign: 'right',
              //backgroundColor: 'red',
            }}>
            {Number(item.Quant).toFixed(3)}
          </Text>
        </WhiteCardForInfo>
      </View>
    );
  }, []);
  return (
    <View style={{flex: 1}}>
      <WhiteCardForInfo
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            width: '50%',
            textAlign: 'left',
            fontWeight: 'bold',
          }}>
          Баркод
        </Text>
        <Text
          style={{
            width: '20%',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Коэф-нт
        </Text>
      </WhiteCardForInfo>
      <FlatList
        data={goodInfo.BcdList}
        keyExtractor={(item, index) => item.Cod + '' + index}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            Список пуст...
          </Text>
        )}
      />
    </View>
  );
};

const ShopRow = ({goodInfo}: {goodInfo: GoodsRow}) => {
  const renderItem = React.useCallback(({item}) => {
    return (
      <View style={{paddingHorizontal: 0, paddingVertical: 4}}>
        <WhiteCardForInfo
          style={{
            backgroundColor: BRIGHT_GREY,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{width: SCREEN_WIDTH * 0.35}}>{item.CodShop}</Text>
          <Text
            style={{
              width: SCREEN_WIDTH * 0.2,
              textAlign: 'center',
            }}>
            {Number(item.Qty).toFixed(3)}
          </Text>
          <Text
            style={{
              width: SCREEN_WIDTH * 0.2,
              textAlign: 'center',
            }}>
            {Number(item.Sold).toFixed(3)}
          </Text>
        </WhiteCardForInfo>
      </View>
    );
  }, []);
  return (
    <View style={{flex: 1}}>
      <WhiteCardForInfo
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.35,
            textAlign: 'left',
            fontWeight: 'bold',
          }}>
          Подр.
        </Text>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.2,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Кол-во
        </Text>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.2,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Продано
        </Text>
      </WhiteCardForInfo>
      <FlatList
        data={goodInfo.ShopsList}
        keyExtractor={(item, index) => item.CodShop + '' + index}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            Список пуст...
          </Text>
        )}
      />
    </View>
  );
};

const Razmeshenie = ({goodInfo}: {goodInfo: GoodsRow}) => {
  const renderItem = React.useCallback(({item}: {item: PlanRow}) => {
    return (
      <View style={{paddingHorizontal: 0, paddingVertical: 4}}>
        <WhiteCardForInfo
          style={{
            backgroundColor: BRIGHT_GREY,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{width: SCREEN_WIDTH * 0.2}}>{item.NumPlan}</Text>
          <Text
            style={{
              width: SCREEN_WIDTH * 0.25,
              textAlign: 'center',
            }}>
            {item.PlaceStr}
          </Text>
          <Text
            style={{
              width: SCREEN_WIDTH * 0.15,
              textAlign: 'center',
            }}>
            {Number(item.Qty).toFixed(3)}
          </Text>
        </WhiteCardForInfo>
      </View>
    );
  }, []);
  return (
    <View>
      <WhiteCardForInfo
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.2,
            textAlign: 'left',
            fontWeight: 'bold',
          }}>
          № яч.
        </Text>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.25,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Размещение
        </Text>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.15,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Кол-во
        </Text>
      </WhiteCardForInfo>
      <SizedBox h={8} />
      <FlatList
        data={goodInfo.PlanList}
        keyExtractor={(item, index) => item.NumPlan + '' + index}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            Список пуст...
          </Text>
        )}
      />
    </View>
  );
};

const MoreInfoCell = ({goodInfo}: {goodInfo: GoodsRow}) => {
  return (
    <View>
      <DopText
        left="Группа"
        right={goodInfo.GroupCod + ' ' + goodInfo.GroupName}
      />
      <DopText
        left="Пост"
        right={goodInfo.SupplCod + ' ' + goodInfo.SupplName}
      />
      <DopText
        left="Баз.Ед.Изм"
        right={goodInfo.MeasCod + ' ' + goodInfo.MeasName}
      />
      <DopText
        left="Страна Пр."
        right={goodInfo.CountryCod + ' ' + goodInfo.CountryName}
      />
      <DopText
        left="Фирма Пр."
        right={goodInfo.ManufCod + ' ' + goodInfo.ManufName}
      />
    </View>
  );
};

const DopText = ({left = '', right = ''}) => {
  return (
    <Text style={{fontWeight: 'bold', fontSize: 16}}>
      {left}: <Text style={{fontWeight: 'normal'}}>{right}</Text>
    </Text>
  );
};

const PalletsRow = ({goodInfo}: {goodInfo: GoodsRow}) => {
  const renderItem = React.useCallback(({item}: {item: PalettRow}) => {
    return (
      <View style={{paddingHorizontal: 0, paddingVertical: 4}}>
        <WhiteCardForInfo
          style={{
            backgroundColor: BRIGHT_GREY,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              width: '35%',
              //backgroundColor: 'red',
            }}>
            {item.NumPal}
          </Text>
          <Text
            style={{
              width: '30%',
              textAlign: 'center',
              //fontWeight: 'bold',
              //backgroundColor: 'red',
            }}>
            {Number(item.Qty).toFixed(3)}
          </Text>
          <Text
            style={{
              width: '30%',
              textAlign: 'right',
            }}>
            {item.CodShop}
          </Text>
        </WhiteCardForInfo>
      </View>
    );
  }, []);
  return (
    <View style={{flex: 1}}>
      <WhiteCardForInfo
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            width: '35%',
            //backgroundColor: 'red',
            textAlign: 'left',
            fontWeight: 'bold',
          }}>
          Палетт
        </Text>
        <Text
          style={{
            width: '30%',
            textAlign: 'center',
            fontWeight: 'bold',
            //backgroundColor: 'red',
          }}>
          Кол-во
        </Text>
        <Text
          style={{
            width: '30%',
            textAlign: 'right',
            fontWeight: 'bold',
            //backgroundColor: 'red',
          }}>
          Подр.
        </Text>
      </WhiteCardForInfo>
      <FlatList
        data={goodInfo.PalletsList}
        keyExtractor={(item, index) => item.CodShop + '' + index}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            Список пуст...
          </Text>
        )}
      />
    </View>
  );
};

const UcensRow = ({goodInfo}: {goodInfo: GoodsRow}) => {
  const renderItem = React.useCallback(({item}: {item: UcenRow}) => {
    return (
      <View style={{paddingHorizontal: 0, paddingVertical: 4}}>
        <WhiteCardForInfo
          style={{
            backgroundColor: BRIGHT_GREY,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text
            style={{
              width: '35%',
              //backgroundColor: 'red'
            }}>
            {item.Cod}
          </Text>
          <Text
            style={{
              width: '15%',
              textAlign: 'center',
              //backgroundColor: 'blue',
            }}>
            {Number(item.Qty).toFixed(3)}
          </Text>
          <Text
            style={{
              width: '20%',
              //backgroundColor: 'orange'
            }}>
            {item.Date}
          </Text>
          <Text
            style={{
              width: '20%',
              textAlign: 'right',
              fontWeight: 'bold',
              //backgroundColor: 'orange',
            }}>
            {item.CodShop}
          </Text>
        </WhiteCardForInfo>
      </View>
    );
  }, []);
  return (
    <View style={{flex: 1}}>
      <WhiteCardForInfo
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            width: '35%',
            textAlign: 'left',
            fontWeight: 'bold',
            //backgroundColor: 'red',
          }}>
          Палетт
        </Text>
        <Text
          style={{
            width: '15%',
            textAlign: 'center',
            fontWeight: 'bold',
            //backgroundColor: 'blue',
          }}>
          Кол-во
        </Text>
        <Text
          style={{
            width: '20%',
            textAlign: 'center',
            fontWeight: 'bold',
            //backgroundColor: 'orange',
          }}>
          Дата
        </Text>
        <Text
          style={{
            width: '20%',
            textAlign: 'right',
            fontWeight: 'bold',
            //backgroundColor: 'orange',
          }}>
          Подр.
        </Text>
      </WhiteCardForInfo>
      <FlatList
        data={goodInfo.UcenList}
        keyExtractor={(item, index) => item.Cod + '' + index}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text
            style={{
              alignSelf: 'center',
              alignItems: 'center',
            }}>
            Список пуст...
          </Text>
        )}
      />
    </View>
  );
};
