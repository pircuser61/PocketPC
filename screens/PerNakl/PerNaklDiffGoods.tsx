import React, {useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import {SCREEN_WIDTH} from '../../constants/funcrions';
import {ReasonRow} from './PerNaklDiffReason';

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
const LI_HEIGHT = 44;
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
    <Cell>{x.QtyTotalPer}</Cell>
  </>
);

const Header = () => (
  <View style={styles.header}>
    <Row x={columnLables} />
  </View>
);

export const PerNaklDiffGoods = ({
  data,
  reason,
  onSubmit,
  onCancel,
  onSelect,
  active,
}: {
  data: PalettRow[];
  reason: {};
  onSubmit?: () => void;
  onCancel: () => void;
  onSelect: (index: number) => void;
  active: boolean;
}) => {
  const listRef = useRef<any>();
  const dp = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

  // console.log('\x1b[34m', 'RENDER DIFF');
  //console.log(dp.getAllData());
  const rowRender = (_: any, item: PalettRow, index: number) => {
    //  console.log('\x1b[36m', 'ROWRENDER ');
    return (
      <TouchableOpacity
        delayLongPress={300}
        onPress={() => {
          onSelect(index);
        }}>
        {' '}
        <View style={styles.rowLine}>
          <Row x={item} />
        </View>
        <Text> {item.CodReason}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SimpleDlg onSubmit={onSubmit} onCancel={onCancel} active={active}>
      <Text style={styles.cellText}>Укажите причины расхождений</Text>
      <View style={styles.LV_View}>
        <Header />
        {dp.getSize() > 0 ? (
          <RecyclerListView
            ref={listRef}
            layoutProvider={layoutProvider}
            dataProvider={dp}
            rowRenderer={rowRender}
            //optimizeForInsertDeleteAnimations={false}
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
  header: {
    flexDirection: 'row',
    height: ROW_HEGHT,
    backgroundColor: '#D1D1D1',
  },
  rowLine: {
    flexDirection: 'row',
    //  width: LI_WITDH,
    height: ROW_HEGHT,
    backgroundColor: '#EEEEEE',
  },
  cellView: {flex: 1, justifyContent: 'center'},
  cellText: {fontSize: 18, textAlign: 'center'},
  LV_View: {
    height: 400,
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingLeft: 10,
    paddingTop: 5,
    marginTop: 5,
  },
});
