import {useReducer} from 'react';
import {StyleSheet, Text} from 'react-native';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';
import {alertMsg} from '../../constants/funcrions';
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
  ReasonDict: object; // Reason as object: [{'1':'A'}, {2:'B'}] => {'1':'A'; '2':'B'}
  CurrPalett?: string; // Текущий палетт, в котором смотрим товары с расхождения
  CurrGood?: number; // номер Товара для которого указывается причина расхождений
  Goods: PalettRow[];
};

type DiffState = {
  step: Steps;
  errText?: string;
  diff: Diff;
  Goods: PalettRow[];
};

type Action = {
  type: string;
  str_value?: string;
  num_value?: number;
};

const initState: DiffState = {
  step: Steps.askDiff,
  diff: {
    HasDiff: 'true',
    Palett: [],
    Reason: {ReasonRow: []},
    ReasonDict: {},
    Goods: [],
  },
  Goods: [],
};

function reducer(state: DiffState, action: Action): DiffState {
  console.log('\x1b[31m', 'DIFF REDUSER: ' + action.type + ' ' + action);

  switch (action.type) {
    case 'diffDlg':
      return {...state, step: Steps.diffPaletts};
    case 'diffGoods':
      if (!action?.str_value)
        return {...state, step: Steps.err, errText: 'Не указан палетт'};

      if (state.diff?.CurrPalett !== action.str_value) {
        state.diff.CurrPalett = action.str_value;
        /*
        state.Goods = state.diff?.Palett.filter(
          x => x.NumPal === action.value,
        )[0].PalettRow;
        */
      }

      return {...state, step: Steps.diffGoods};

    case 'diffReason':
      if (!state.diff)
        return {...state, step: Steps.err, errText: 'Нет расхождений'};
      if (!action?.num_value)
        return {...state, step: Steps.err, errText: 'Не указан товар'};
      state.diff.CurrGood = action.num_value;
      return {...state, step: Steps.diffReason};

    case 'setDiffReason': {
      if (!state.Goods)
        return {...state, step: Steps.err, errText: 'Нет товаров'};
      if (!action?.str_value)
        return {...state, step: Steps.err, errText: 'Не выбрана причина'};
      if (!state.diff?.CurrGood)
        return {
          ...state,
          step: Steps.err,
          errText: 'Не выбран товар',
        };
      state.Goods[state.diff?.CurrGood].CodReason = action.str_value;
      return {...state, step: Steps.diffGoods};
    }
  }
  alertMsg('unsupported action: ' + action.type);
  return {...state};
}

const PerNaklDiff = ({
  onSubmit,
  onCancel,
}: // initState2,
{
  onSubmit: () => void;
  onCancel: () => void;
  //initState2?: Diff;
}) => {
  const [state, dispatch] = useReducer(reducer, initState);

  switch (state.step) {
    case Steps.askDiff:
      return (
        <SimpleDlg
          onSubmit={() => {
            dispatch({type: 'diffDlg'});
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
          data={state.diff.Palett}
          onCancel={onCancel}
          onSubmit={() => {
            dispatch({type: 'getUserFrom'});
          }}
          onSelect={(numPal: string) => {
            dispatch({type: 'diffGoods', str_value: numPal});
          }}
          active={true}
        />
      );
    case Steps.diffGoods:
      return (
        <PerNaklDiffGoods
          data={state.Goods}
          reason={state.diff.Reason.ReasonRow}
          onCancel={onCancel}
          onSubmit={() => {
            dispatch({type: 'diffDlg'});
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
          data={state.diff?.Reason.ReasonRow}
          onCancel={onCancel}
          onSelect={(codReason: string) => {
            dispatch({type: 'setDiffReason', str_value: codReason});
          }}
          active={true}
        />
      );
    default:
      return (
        <SimpleDlg onCancel={onCancel}>
          <Text style={styles.labelText}>Непредвиденная ошибка</Text>
          <Text style={styles.labelText}>{state.errText}</Text>
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
