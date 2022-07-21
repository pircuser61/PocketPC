import React, {useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import {SCREEN_WIDTH} from '../../constants/funcrions';
import PerNaklDiff, {PalettRow} from './PerNaklDiffGoods';

export type Palett = {
  NumPal: string;
  PalettRow: PalettRow[];
};

const LI_WITDH = SCREEN_WIDTH - 20;
const LI_HEIGHT = 44;
const ROW_HEGHT = 40;

export const PerNaklDiffPal = ({
  data,
  onSubmit,
  onCancel,
  onSelect,
  active,
}: {
  data: Palett[];
  onSubmit?: () => void;
  onCancel: () => void;
  onSelect: (x: string) => void;
  active: boolean;
}) => {
  const dp = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

  console.log('\x1b[34m', 'RENDER LIST PAL');
  console.log(data);

  const rowRender = (_: any, item: Palett) => {
    console.log(item);
    return (
      <TouchableOpacity
        style={styles.rowLine}
        delayLongPress={300}
        onPress={() => {
          onSelect(item.NumPal);
        }}>
        <Text style={styles.cellText}>{item.NumPal}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SimpleDlg onSubmit={onSubmit} onCancel={onCancel} active={active}>
      <Text style={styles.cellText}>
        Уажите расхождения для каждой из палетт
      </Text>
      <View style={styles.LV_View}>
        {dp.getSize() > 0 ? (
          <RecyclerListView
            layoutProvider={layoutProvider}
            dataProvider={dp}
            rowRenderer={rowRender}
          />
        ) : (
          <Text style={styles.cellText}>Нет данных</Text>
        )}
      </View>
    </SimpleDlg>
  );
};

export default PerNaklDiffPal;

const layoutProvider = new LayoutProvider(
  _ => 0,
  (_, dim) => {
    dim.width = LI_WITDH;
    dim.height = LI_HEIGHT;
  },
);

const styles = StyleSheet.create({
  rowLine: {
    flexDirection: 'row',
    paddingTop: 5,
    paddingLeft: 10,
    height: ROW_HEGHT,
    backgroundColor: '#EEEEEE',
  },

  cellText: {fontSize: 20},
  LV_View: {
    height: 400,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingLeft: 10,
    paddingTop: 5,
    marginTop: 5,
  },
});
