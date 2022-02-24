import {observer} from 'mobx-react-lite';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {NativeStackScreenProps} from 'react-native-screens/lib/typescript/native-stack';
import Feather from 'react-native-vector-icons/Feather';
import {MAIN_COLOR} from '../../constants/funcrions';
import {
  NakladnayaSpeckInterface,
  ProverkaNakladnyhNavProps,
  ProvperSpecsRow,
} from '../../types/types';

const BottomActionBar = (
  props: {
    specsInfo: ProvperSpecsRow | null;
    isFilter: 'true' | 'false';
    createOrNavNakl: (
      NumNakl: string,
      isSecondScreen?: boolean,
    ) => Promise<void>;
    relativePosition: {
      first?: ProvperSpecsRow;
      last?: ProvperSpecsRow;
    };
    getInfoWorkLet: ({
      Cmd,
      NumNakl,
      isSecondScreen,
    }: NakladnayaSpeckInterface) => void;
  } & NativeStackScreenProps<ProverkaNakladnyhNavProps, 'WorkWithNakladnaya'>,
) => {
  const {
    relativePosition,
    specsInfo,
    getInfoWorkLet,
    createOrNavNakl,
    navigation,
    route,
    isFilter,
  } = props;

  function getFirst() {
    getInfoWorkLet({Cmd: 'first', isFilter});
  }
  function getLast() {
    getInfoWorkLet({Cmd: 'last', isFilter});
  }
  function getNext() {
    getInfoWorkLet({Cmd: 'next', NumNakl: specsInfo?.NumNakl, isFilter});
  }
  function getPrev() {
    getInfoWorkLet({Cmd: 'prev', NumNakl: specsInfo?.NumNakl, isFilter});
  }
  function goToCreate() {
    navigation.navigate('AddNakladnyaScreen', {
      NumProv: route.params.NumProv,
      createOrNavNakl,
    });
  }

  return (
    <View
      style={{
        backgroundColor: MAIN_COLOR,
        height: 48,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        alignItems: 'center',
      }}>
      <TouchableOpacity style={styles.buttonCircle} onPress={getFirst}>
        <Feather name="chevrons-left" size={20} color="white" />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.buttonCircle,
          {
            opacity:
              specsInfo?.NumNakl === relativePosition.first?.NumNakl ? 0 : 1,
          },
        ]}
        onPress={getPrev}
        disabled={specsInfo?.NumNakl === relativePosition.first?.NumNakl}>
        <Feather name="chevron-left" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonCircle} onPress={goToCreate}>
        <Feather name="plus" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.buttonCircle,
          {
            opacity:
              specsInfo?.NumNakl === relativePosition.last?.NumNakl ? 0 : 1,
          },
        ]}
        onPress={getNext}
        disabled={specsInfo?.NumNakl === relativePosition.last?.NumNakl}>
        <Feather name="chevron-right" size={20} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.buttonCircle} onPress={getLast}>
        <Feather name="chevrons-right" size={20} color="white" />
      </TouchableOpacity>
    </View>
  );
};

/**
 *   <TouchableOpacity style={styles.buttonCircle} onPress={goToCreate}>
        <Feather name="plus" size={20} color="white" />
      </TouchableOpacity>
 */
export default BottomActionBar;

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
