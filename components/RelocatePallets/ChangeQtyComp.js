import {observer} from 'mobx-react-lite';
import React from 'react';
import {StyleSheet, Text, TextInput, View} from 'react-native';
import RelocaPalletsteStore from '../../mobx/RelocaPalletsteStore';

const ChangeQtyComp = observer(
  ({
    data = '',
    title = '',
    keystroke = '',
    editable = true,
    forwardedRef,
    onSubmit = () => {},
    blurOnSubmit = true,
    valueFullInfo = '',
  }) => {
    return (
      <View
        style={{
          height: 100,
          width: '46%',
          backgroundColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 8,
        }}>
        <Text style={{fontSize: 10, fontWeight: 'bold'}}>{title}:</Text>
        <View
          style={{backgroundColor: 'white', borderRadius: 4, borderWidth: 1}}>
          <TextInput
            onSubmitEditing={onSubmit}
            ref={forwardedRef}
            blurOnSubmit={blurOnSubmit}
            editable={editable}
            onFocus={() => {
              RelocaPalletsteStore.changeLocation[keystroke] = '';
            }}
            onEndEditing={() => {
              if (RelocaPalletsteStore.changeLocation[keystroke] === '') {
                if (valueFullInfo !== '0' || valueFullInfo !== '')
                  RelocaPalletsteStore.changeLocation[
                    keystroke
                  ] = valueFullInfo;
                else RelocaPalletsteStore.changeLocation[keystroke] = '0';
              }
            }}
            style={{alignSelf: 'center', width: 100, textAlign: 'center'}}
            keyboardType={'number-pad'}
            value={RelocaPalletsteStore.changeLocation[keystroke]}
            onChangeText={txt =>
              (RelocaPalletsteStore.changeLocation[keystroke] = txt)
            }
          />
        </View>
      </View>
    );
  },
);

const WrappedComponent = React.forwardRef((props, ref) => {
  return <ChangeQtyComp {...props} forwardedRef={ref} />;
});

export default WrappedComponent;

const styles = StyleSheet.create({});
