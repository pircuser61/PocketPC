import React, {useState} from 'react';
import {StyleSheet, Text, TextInput} from 'react-native';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';

const TtnCreateDlg = ({
  onSubmit,
  onCancel,
  active,
}: {
  onSubmit: (x: string) => void;
  onCancel: () => void;
  active: boolean;
}) => {
  const [codOb, setCodOb] = useState('');

  return (
    <SimpleDlg onSubmit={() => onSubmit(codOb)} onCancel={onCancel}>
      <Text style={styles.labelText}>Объединение-получатель</Text>
      <TextInput
        style={styles.input}
        placeholder="Укажить код объединения"
        onChangeText={setCodOb}
        editable={active}
      />
    </SimpleDlg>
  );
};

export default TtnCreateDlg;

const styles = StyleSheet.create({
  labelText: {
    paddingTop: 10,
    fontSize: 18,
  },
  input: {
    paddingBottom: 10,
    paddingLeft: 16,
    fontSize: 18,

    backgroundColor: 'white',
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    height: 48,
    marginVertical: 8,
  },
});
