import React, {useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import {SCREEN_WIDTH} from '../../constants/funcrions';
import {Palett} from './PerNaklDiffPal';

export type PalettRow = {
  CodGood: string;
  QtyFact: string;
  QtyPal: string;
  QtyTotalPer: string;
  QtyTotalPal: string;

  CodReason?: string;
  QtyDiff?: string;
};

const columnLables: PalettRow = {
  CodGood: 'Код товара',
  QtyTotalPer: 'В накл.',
  QtyTotalPal: 'Во всех палеттах',
  QtyFact: 'Факт',
  QtyPal: 'В палетте',
  CodReason: 'Причина',
};

const LI_WITDH = SCREEN_WIDTH - 20;
const LI_HEIGHT = 64;
const ROW_HEGHT = 40;

const layoutProvider = new LayoutProvider(
  _ => 0,
  (_, dim) => {
    dim.width = LI_WITDH;
    dim.height = LI_HEIGHT;
  },
);

const Cell = ({children}: {children?: React.ReactNode}) => (
  <View style={styles.cellView}>
    <Text style={styles.cellText}>{children}</Text>
  </View>
);

const Row = ({x}: {x: PalettRow}) => (
  <>
    <Cell>{x.CodGood}</Cell>
    <Cell>{x.QtyFact}</Cell>
    <Cell>{x.QtyPal}</Cell>
  </>
);

export const PerNaklDiffGoods = ({
  palett,
  reason,
  onSubmit,
  onCancel,
  onSelect,
  active,
}: {
  palett: Palett;
  reason: {[key: string]: string};
  onSubmit?: () => void;
  onCancel: () => void;
  onSelect: (index: number) => void;
  active: boolean;
}) => {
  const dp = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(
    palett.PalettRow,
  );

  console.log('\x1b[34m', 'RENDER GOODS');
  console.log(dp.getAllData());
  const rowRender = (_: any, item: PalettRow, index: number) => {
    //  console.log('\x1b[36m', 'ROWRENDER ');
    return (
      <TouchableOpacity
        style={styles.rowView}
        delayLongPress={300}
        onPress={() => {
          onSelect(index);
        }}>
        <View style={{flexDirection: 'row'}}>
          <Row x={item} />
        </View>

        <Text style={styles.reasonText}>
          {reason === undefined
            ? 'Справочник пуст'
            : item.CodReason === undefined
            ? 'Не указана'
            : reason[item.CodReason] ?? 'Нет в справочнике'}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SimpleDlg onSubmit={onSubmit} onCancel={onCancel} active={active}>
      <Text style={styles.cellText}>Укажите причины расхождений</Text>
      <View style={styles.headerRowView}>
        <Row x={columnLables} />
      </View>
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

export default PerNaklDiffGoods;

const styles = StyleSheet.create({
  headerRowView: {
    flexDirection: 'row',
    height: ROW_HEGHT,
    backgroundColor: '#D1D1D1',
  },
  rowView: {
    height: LI_HEIGHT - 2,
    backgroundColor: '#EEEEEE',
    paddingLeft: 10,
  },
  cellView: {flex: 1, justifyContent: 'center'},
  cellText: {fontSize: 18, textAlign: 'center'},
  reasonText: {fontSize: 16},
  LV_View: {
    height: 400,
    borderBottomWidth: 1,
    borderTopWidth: 1,

    paddingTop: 5,
    marginTop: 5,
  },
});
