import React from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';
import {FlatList} from 'native-base';

export type ReasonRow = {Cod: string; Name: string};

const ROW_HEGHT = 60;

export const PerNaklDiffReason = ({
  data,
  onSelect,
  onCancel,
  active,
}: {
  data?: ReasonRow[];
  onSelect: (codReasong: string) => void;
  onCancel: () => void;
  //  onSelect: (x: string) => void;
  active: boolean;
}) => {
  // console.log('\x1b[34m', 'RENDER DIFF');
  //console.log(dp.getAllData());
  const renderItem = ({item}: {item: ReasonRow}) => {
    //  console.log('\x1b[36m', 'ROWRENDER ');
    return (
      <TouchableOpacity
        delayLongPress={300}
        onPress={() => {
          onSelect(item.Cod);
        }}
        style={styles.rowLine}>
        <Text style={styles.cellText}>{item.Name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SimpleDlg onCancel={onCancel} active={active}>
      <Text style={styles.cellText}>Укажите причину</Text>

      <FlatList
        style={styles.LV_View}
        data={data}
        renderItem={renderItem}
        keyExtractor={item => item.Cod}
      />
    </SimpleDlg>
  );
};

export default PerNaklDiffReason;

const styles = StyleSheet.create({
  rowLine: {
    justifyContent: 'center',
    height: ROW_HEGHT,
    backgroundColor: '#EEEEEE',
    marginTop: 10,
  },
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
