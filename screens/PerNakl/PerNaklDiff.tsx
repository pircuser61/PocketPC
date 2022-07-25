import React, {useReducer} from 'react';

import {StyleSheet, Text} from 'react-native';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';
import PerNaklDiffGoods, {PalettRow} from './PerNaklDiffGoods';
import PerNaklDiffPal, {Palett} from './PerNaklDiffPal';
import PerNaklDiffReason, {ReasonRow} from './PerNaklDiffReason';

/*
Работа с несоответствиями
*/

enum Steps {
  askDiff,
  diffPaletts,
  diffGoods,
  diffReason,
  err,
}

export type Diff = {
  HasDiff: string;
  Palett: Palett[]; // список палетт в накладной

  Reason: {ReasonRow: ReasonRow[]}; // список доступных причин
  ReasonDict: {[key: string]: string}; // Reason as object: [{'1':'A'}, {2:'B'}] => {'1':'A'; '2':'B'}
  CurrPalett?: Palett; // Текущий палетт, в котором смотрим товары с расхождения
  CurrGood?: PalettRow; // номер Товара для которого указывается причина расхождений
};

type DiffState = Diff & {
  step: Steps;
  errText?: string;
};

type Action = {
  type: string;
  str_value?: string;
  num_value?: number;
};

function reducer(state: DiffState, action: Action): DiffState {
  console.log(
    '\x1b[31m',
    'DIFF REDUSER: ' +
      action.type +
      ' ' +
      action.type +
      ' ' +
      action.num_value +
      ' ' +
      action.str_value,
  );

  switch (action.type) {
    case 'diffPaletts':
      return {...state, step: Steps.diffPaletts};
    case 'diffGoods':
      if (action?.num_value !== undefined && action?.num_value >= 0) {
        state.CurrPalett = state.Palett[action.num_value];
        return {...state, step: Steps.diffGoods};
      }
      return {...state, step: Steps.err, errText: 'Не указан палетт'};

    case 'diffReason':
      if (state.CurrPalett === undefined) {
        return {...state, step: Steps.err, errText: 'Не указан палетт'};
      }
      if (action?.num_value !== undefined && action?.num_value >= 0) {
        state.CurrGood = state.CurrPalett.PalettRow[action.num_value];
        return {...state, step: Steps.diffReason};
      }
      return {...state, step: Steps.err, errText: 'Не указан товар'};
    case 'setDiffReason': {
      if (!state.CurrGood)
        return {
          ...state,
          step: Steps.err,
          errText: 'Не выбран товар',
        };
      if (!action.str_value)
        return {
          ...state,
          step: Steps.err,
          errText: 'Не выбрана причина',
        };
      state.CurrGood.CodReason = action.str_value;

      return {...state, step: Steps.diffGoods};
    }

    default:
      return {
        ...state,
        step: Steps.err,
        errText: 'unsupported action: ' + action.type,
      };
  }
}

const PerNaklDiff = ({
  onSubmit,
  onCancel,
  data,
}: {
  onSubmit: () => void;
  onCancel: () => void;
  data: Diff;
}) => {
  const [state, dispatch] = useReducer(reducer, {
    ...data,
    step: Steps.askDiff,
  });
  console.log(data);
  switch (state.step) {
    case Steps.askDiff:
      return (
        <SimpleDlg
          onSubmit={() => {
            dispatch({type: 'diffPaletts'});
          }}
          onCancel={onCancel}>
          <Text style={styles.labelText}>
            Внимние! Есть расхождения. Продолжить?
          </Text>
        </SimpleDlg>
      );

    case Steps.diffPaletts:
      return (
        <PerNaklDiffPal
          data={state.Palett ?? []}
          onCancel={onCancel}
          onSubmit={onSubmit}
          onSelect={(ix: number) => {
            dispatch({type: 'diffGoods', num_value: ix});
          }}
          active={true}
        />
      );
    case Steps.diffGoods:
      return (
        <PerNaklDiffGoods
          palett={state.CurrPalett!}
          reason={state.ReasonDict}
          onCancel={onCancel}
          onSubmit={() => {
            dispatch({type: 'diffPaletts'});
          }}
          onSelect={(ix: number) => {
            dispatch({type: 'diffReason', num_value: ix});
          }}
          active={true}
        />
      );
    case Steps.diffReason:
      return (
        <PerNaklDiffReason
          data={state.Reason.ReasonRow ?? []}
          onCancel={onCancel}
          onSelect={(codReason: string) => {
            dispatch({type: 'setDiffReason', str_value: codReason});
          }}
        />
      );
    case Steps.err:
      return (
        <SimpleDlg onCancel={onCancel}>
          <Text style={styles.labelText}>Непредвиденная ошибка</Text>
          <Text style={styles.labelText}>{state.errText}</Text>
        </SimpleDlg>
      );
    default:
      return (
        <SimpleDlg onCancel={onCancel}>
          <Text style={styles.labelText}>Ошибка статуса...</Text>
          <Text>{state.step}</Text>
        </SimpleDlg>
      );
  }
};

export default PerNaklDiff;

const styles = StyleSheet.create({
  buttonStyle: {width: 120, alignItems: 'center'},
  buttonStyleV: {height: 90, width: 150},
  row: {flexDirection: 'row', justifyContent: 'flex-start', paddingBottom: 20},
  background: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    width: 360,
  },
  labelText: {
    fontSize: 20,
    paddingLeft: 20,
    paddingTop: 10,
    fontWeight: 'bold',
  },
  simpleText: {
    fontSize: 20,
    padding: 20,
  },
  shadowView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.8)',
  },
});
