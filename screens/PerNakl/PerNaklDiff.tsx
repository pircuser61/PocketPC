import React, {useRef} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';
import {DataProvider, LayoutProvider, RecyclerListView} from 'recyclerlistview';
import {SCREEN_WIDTH} from '../../constants/funcrions';

export type PerNaklDiffRow = {
  CodGood: string;
  QtyFact: string;
  QtyPer: string;
  CodReason: string;
  QtyDiff?: string;
};

const columnLables: PerNaklDiffRow = {
  CodGood: 'Код товара',
  QtyPer: 'В накл.',
  QtyFact: 'Факт',
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

const styles = StyleSheet.create({
  header: {
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

const Cell = ({children}: {children?: React.ReactNode}) => (
  <View style={styles.cellView}>
    <Text style={styles.cellText}>{children}</Text>
  </View>
);

const Row = ({x, style}: {x: PerNaklDiffRow; style?: any}) => (
  <View style={style ? style : styles.rowLine}>
    <Cell>{x.CodGood}</Cell>
    <Cell>{x.QtyFact}</Cell>
    <Cell>{x.QtyPer}</Cell>
  </View>
);

const Header = () => (
  <Row x={columnLables} style={[styles.rowLine, styles.header]} />
);

const rowRender = (_: any, item: PerNaklDiffRow) => {
  //  console.log('\x1b[36m', 'ROWRENDER ');
  return <Row x={item} />;
};

export const PerNaklDiff = ({
  data,
  onSubmit,
  onCancel,
  active,
}: {
  data: PerNaklDiffRow[];
  onSubmit?: () => void;
  onCancel: () => void;
  active: boolean;
}) => {
  const listRef = useRef<any>();
  const dp = new DataProvider((r1, r2) => r1 !== r2).cloneWithRows(data);

  // console.log('\x1b[34m', 'RENDER DIFF');
  //console.log(dp.getAllData());

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

export default PerNaklDiff;
