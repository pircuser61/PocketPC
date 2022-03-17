import {SCREEN_HEIGHT} from '@gorhom/bottom-sheet';
import React, {ReactNode, useState, useCallback} from 'react';
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {Divider} from 'react-native-paper';
import {BRIGHT_GREY, MAIN_COLOR, SCREEN_WIDTH} from '../../constants/funcrions';
import CheckPalletsStore from '../../mobx/CheckPalletsStore';
import {
  BarCod,
  BarCodRow,
  GoodsRow,
  PalettRow,
  PlanRow,
} from '../../types/ProverkaTypes';
import {ShopRow} from '../../types/types';
import EmptyListComponent from '../SystemComponents/EmptyListComponent';
import WhiteCardForInfo from '../SystemComponents/WhiteCardForInfo';
import {FirstCell, SecondCell} from './FirstCell';
import Feather from 'react-native-vector-icons/Feather';
import MenuListComponent from '../SystemComponents/MenuListComponent';
import TitleAndDiscribe from './TitleAndDiscribe';
import SizedBox from '../SystemComponents/SizedBox';

const HorizontalListForDocument = ({
  goodInfo,
  listItems,
  index,
  customRef,
}: {
  goodInfo: GoodsRow;
  setIndex?: (index: number) => void;
  index: number;
  listItems: number[];
  customRef?: any;
}) => {
  const Item = useCallback(
    ({item}: {item: number}) => {
      switch (index) {
        case 0:
          return (
            <View style={{justifyContent: 'center'}}>
              <FirstCell {...goodInfo} />
              <SecondCell {...goodInfo} />
            </View>
          );
          break;
        case 1:
          return <BarcodesBox goodInfo={goodInfo} />;
          break;
        case 2:
          return <PalletsBox goodInfo={goodInfo} />;
          break;
        case 3:
          return <OstatkiByPodr goodInfo={goodInfo} />;
          break;
        case 4:
          return <Planogramma goodInfo={goodInfo} />;
          break;
        default:
          return (
            <View
              style={{
                //backgroundColor: BRIGHT_GREY,
                alignSelf: 'center',
                backgroundColor: 'white',
                overflow: 'hidden',
                flex: 1,
              }}>
              <Item item={index} />
            </View>
          );
          break;
      }
    },
    [index, goodInfo],
  );

  return (
    <View style={{flex: 1, paddingHorizontal: 16, overflow: 'hidden'}}>
      <View style={{backgroundColor: 'white', flex: 1, borderRadius: 8}}>
        <Item item={index} />
        <Text style={{position: 'absolute', right: 4}}>
          {index + 1}/{listItems.length}
        </Text>
      </View>
    </View>
  );
};

export default HorizontalListForDocument;

const styles = StyleSheet.create({
  buttonCircle: {
    backgroundColor: MAIN_COLOR,
    height: 40,
    width: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 32,
  },
});

// return (
//   <View
//     style={{
//       width: SCREEN_WIDTH,
//       backgroundColor: 'white',
//     }}>
//     <View style={{height: 8}} />
//     <Text style={{fontSize: 16, alignSelf: 'center', fontWeight: 'bold'}}>
//       {title}
//     </Text>
//     <View style={{paddingHorizontal: 16}}>
//       <HeaderItem />
//     </View>

//     {list.length > 0 ? (
//       <ScrollView style={{paddingHorizontal: 16}}>
//         {list.map((r, i) => (
//           <View key={i}>
//             <Item {...r} />
//             <View style={{height: 8}} />
//           </View>
//         ))}
//       </ScrollView>
//     ) : (
//       <Text
//         style={{
//           alignSelf: 'center',
//           flex: 1,
//           justifyContent: 'center',
//           alignItems: 'center',
//         }}>
//         Список пуст...
//       </Text>
//     )}
//   </View>
// );

const BarcodesBox = ({goodInfo}: {goodInfo: GoodsRow}) => {
  const renderItem = React.useCallback(({item}) => {
    return (
      <View style={{paddingHorizontal: 8, paddingVertical: 4}}>
        <WhiteCardForInfo
          style={{
            backgroundColor: BRIGHT_GREY,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{width: SCREEN_WIDTH * 0.35}}>{item.Cod}</Text>
          <Text
            style={{
              width: SCREEN_WIDTH * 0.2,
              textAlign: 'center',
            }}>
            {Number(item.Quant).toFixed(3)}
          </Text>
          <Text
            style={{
              width: SCREEN_WIDTH * 0.2,
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
      <Text style={{fontSize: 12, alignSelf: 'center', fontWeight: 'bold'}}>
        Список баркодов
      </Text>
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
          Баркод
        </Text>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.2,
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Коэф-нт
        </Text>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.3,
            textAlign: 'right',
            fontWeight: 'bold',
          }}>
          Подр.
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

const PalletsBox = ({goodInfo}: {goodInfo: GoodsRow}) => {
  const renderItem = React.useCallback(({item}) => {
    return (
      <View style={{paddingHorizontal: 8, paddingVertical: 4}}>
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
            {item.NumPal}
          </Text>
          <Text
            style={{
              width: SCREEN_WIDTH * 0.2,
              textAlign: 'right',
            }}>
            {item.Qty}
          </Text>
        </WhiteCardForInfo>
      </View>
    );
  }, []);

  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 12, alignSelf: 'center', fontWeight: 'bold'}}>
        Список паллет
      </Text>
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
          Паллет
        </Text>
        <Text
          style={{
            width: SCREEN_WIDTH * 0.2,
            textAlign: 'right',
            fontWeight: 'bold',
          }}>
          Кол-во
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
  // return (
  //   <Template
  //     title={'Список паллет'}
  //     list={goodInfo.PalletsList}
  //     HeaderItem={() => (
  //       <WhiteCardForInfo
  //         style={{
  //           flexDirection: 'row',
  //           justifyContent: 'space-between',
  //           alignItems: 'center',
  //         }}>
  //         <Text
  //           style={{
  //             width: SCREEN_WIDTH * 0.35,
  //             textAlign: 'left',
  //             fontWeight: 'bold',
  //           }}>
  //           Подр.
  //         </Text>
  //         <Text
  //           style={{
  //             width: SCREEN_WIDTH * 0.2,
  //             textAlign: 'center',
  //             fontWeight: 'bold',
  //           }}>
  //           Паллет
  //         </Text>
  //         <Text
  //           style={{
  //             width: SCREEN_WIDTH * 0.2,
  //             textAlign: 'right',
  //             fontWeight: 'bold',
  //           }}>
  //           Кол-во
  //         </Text>
  //       </WhiteCardForInfo>
  //     )}
  //     Item={(r: PalettRow) => {
  //       return (
  //         <WhiteCardForInfo
  //           style={{
  //             backgroundColor: BRIGHT_GREY,

  //             flexDirection: 'row',
  //             justifyContent: 'space-between',
  //             alignItems: 'center',
  //           }}>
  //           <Text style={{width: SCREEN_WIDTH * 0.35}}>{r.CodShop}</Text>
  //           <Text
  //             style={{
  //               width: SCREEN_WIDTH * 0.2,
  //               textAlign: 'center',
  //             }}>
  //             {r.NumPal}
  //           </Text>
  //           <Text
  //             style={{
  //               width: SCREEN_WIDTH * 0.2,
  //               textAlign: 'right',
  //             }}>
  //             {r.Qty}
  //           </Text>
  //         </WhiteCardForInfo>
  //       );
  //     }}
  //   />
  // );
};

const OstatkiByPodr = ({goodInfo}: {goodInfo: GoodsRow}) => {
  const renderItem = React.useCallback(({item}) => {
    return (
      <View style={{paddingHorizontal: 8, paddingVertical: 4}}>
        <WhiteCardForInfo
          style={{
            backgroundColor: BRIGHT_GREY,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <Text style={{width: '50%', textAlign: 'center'}}>
            {item.CodShop}
          </Text>
          <Text
            style={{
              width: '50%',
              textAlign: 'center',
            }}>
            {item.Qty}
          </Text>
        </WhiteCardForInfo>
      </View>
    );
  }, []);

  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 12, alignSelf: 'center', fontWeight: 'bold'}}>
        Список остатков
      </Text>
      <WhiteCardForInfo
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text
          style={{
            width: '50%',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Подр.
        </Text>
        <Text
          style={{
            width: '50%',
            textAlign: 'center',
            fontWeight: 'bold',
          }}>
          Кол-во
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

const Planogramma = ({goodInfo}: {goodInfo: GoodsRow}) => {
  const renderItem = React.useCallback(({item}: {item: PlanRow}) => {
    return (
      <View style={{paddingHorizontal: 8, paddingVertical: 4}}>
        <WhiteCardForInfo
          style={{
            backgroundColor: BRIGHT_GREY,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <TitleAndDiscribe
              title={'Ячейка'}
              discribe={item.NumPlan}
              fontSize={14}
            />
            <SizedBox w={16} />
            <TitleAndDiscribe
              title={'Количество'}
              discribe={item.Qty}
              fontSize={14}
            />
            {/* <Text style={{width: '50%', textAlign: 'center'}}>
              {item.NumPlan}
            </Text>
            <Text
              style={{
                width: '50%',
                textAlign: 'center',
              }}>
              {item.Qty}
            </Text> */}
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              //paddingHorizontal: 16,
            }}>
            <TitleAndDiscribe
              title={'Отдел.'}
              discribe={item.Place?.CodDep}
              fontSize={14}
            />
            <TitleAndDiscribe
              title={'Сектор'}
              discribe={item.Place?.NumSec}
              fontSize={14}
            />
            <TitleAndDiscribe
              title={'Стелаж'}
              discribe={item.Place?.NumStel}
              fontSize={14}
            />
            <TitleAndDiscribe
              title={'Место'}
              discribe={item.Place?.NumPl}
              fontSize={14}
            />
          </View>
        </WhiteCardForInfo>
      </View>
    );
  }, []);

  return (
    <View style={{flex: 1}}>
      <Text style={{fontSize: 12, alignSelf: 'center', fontWeight: 'bold'}}>
        Планограмма
      </Text>

      <FlatList
        data={goodInfo.PlanogramPlaceList}
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
