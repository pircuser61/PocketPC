import React, {useEffect, useReducer} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import LoginDlg from '../../components/SystemComponents/LoginDlg';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
//import request from '../../soap-client/pocketRequest';
import request from '../../functions/pocketRequestN';
import {alertMsg, alertError} from '../../constants/funcrions';
//@ts-ignore
import md5 from 'md5';
import UserStore from '../../mobx/UserStore';
import SimpleDlg from '../../components/SystemComponents/SimpleDlg';
import useIsMounted from '../../customHooks/UseMountedHook';
import PerNaklDiff, {PerNaklDiffRow} from './PerNaklDiff';

enum Steps {
  ask,
  loginFrom,
  kppDlg,
  loginTo,
  askDiff,
  diffDlg,
}

type NaklInfo = {
  PerZo: string;
  Closed: string;
  UseSkl: string;
  UserFrom: string;
  UserTo: string;
  UserKpp: string;
  KppInfo: string;
};

type Response = NaklInfo & {
  PerNaklDiff?: {PerNaklDiffRow?: PerNaklDiffRow[]};
};

type State = {
  step: Steps;
  isLoading: boolean;
  PassFrom: string;
  diff?: PerNaklDiffRow[];
} & NaklInfo;

type Action = {
  type: string;
  user?: {login: string; passw: string};
  response?: Response;
};

const initState: State = {
  step: Steps.ask,
  UserFrom: '',
  PassFrom: '',
  UserTo: '',
  UserKpp: '',
  KppInfo: '',
  isLoading: false,
  PerZo: '',
  UseSkl: '',
  Closed: '',
};

function reducer(state: State, action: Action): State {
  state.isLoading = false;
  switch (action.type) {
    case 'request':
      return {...state, isLoading: true};
    case 'response': {
      if (action.response?.PerZo === 'true') {
        let newState = {...state, ...action.response};
        if (!newState.UserFrom) newState.step = Steps.loginFrom;
        else newState.step = newState.UserKpp ? Steps.kppDlg : Steps.loginTo;
        return newState;
      }

      if (action.response?.PerNaklDiff?.PerNaklDiffRow) {
        console.log('\x1b[31m', 'REDUSER');
        console.log(action.response.PerNaklDiff.PerNaklDiffRow);
        return {
          ...state,
          step: Steps.askDiff,
          diff: action.response.PerNaklDiff.PerNaklDiffRow ?? [],
        };
      }

      alertMsg('Накладная НЕ закрыта!');
      return {...state, step: Steps.ask};
    }
    case 'userFrom':
      return {
        ...state,
        UserFrom: action.user!.login,
        PassFrom: action.user!.passw,

        step: state.UserKpp ? Steps.kppDlg : Steps.loginTo,
      };
    case 'getUserTo':
      return {...state, step: Steps.loginTo};

    case 'diffDlg':
      return {...state, step: Steps.diffDlg};
  }
  alertMsg('unsupported action: ' + action.type);
  return {...state};
}

const PerNaklClose = ({
  numNakl,
  onHide,
}: {
  numNakl: string;
  onHide: () => void;
}) => {
  const [state, dispatch] = useReducer(reducer, initState);
  const isMounted = useIsMounted();

  const exitWithMsg = (msg: string) => {
    if (isMounted.current) alertMsg(msg);
    onHide();
  };
  const parseParam = {
    arrayAccessFormPaths: ['PocketPerClose.PerNaklDiff.PerNaklDiffRow'],
  };

  console.log('\x1b[34m', 'RENDER');
  //console.log(state);

  const endCloseNakl = async (userTo: string, passwTo: string) => {
    try {
      dispatch({type: 'request'});
      const req = {
        numNakl,
        DeviceName: UserStore.user?.deviceName,
        userFrom: state.UserFrom,
        passwFrom: md5(state.PassFrom),
        userTo,
        passwTo: md5(passwTo),
      };
      if (state.diff) {
        state.diff = state.diff.map(x => {
          x.CodReason = '01';
          x.QtyDiff = Number(x.QtyPer) - Number(x.QtyFact) + '';
          return x;
        });
        Object.assign(req, {PerNaklDiff: {PerNaklDiffRow: state.diff}});
      }
      const response: Response = await request(
        'PocketPerClose',
        req,
        parseParam,
      );
      if (response.Closed === 'true') {
        exitWithMsg('Накладная закрыта');
      } else {
        throw Error('Накладная НЕ закрыта!');
      }
    } catch (error) {
      if (isMounted.current) alertError(error);
      // onHide();
    }
  };

  const tryCloseNakl = async () => {
    try {
      dispatch({type: 'request'});

      const response: NaklInfo = await request(
        'PocketPerClose',
        {
          numNakl,
          DeviceName: UserStore.user?.deviceName,
          NoError: 'true',
        },
        parseParam,
      );
      if (response.Closed === 'true') {
        exitWithMsg('Накладная закрыта');
      } else {
        dispatch({type: 'response', response});
      }
    } catch (error) {
      if (isMounted.current) alertError(error);
      onHide();
    }
  };

  switch (state.step) {
    case Steps.ask:
      return (
        <SimpleDlg onSubmit={tryCloseNakl} onCancel={onHide}>
          <Text style={styles.labelText}>
            {'Закрыть накладную ' + numNakl + '?'}
          </Text>
        </SimpleDlg>
      );
    case Steps.askDiff:
      return (
        <SimpleDlg
          onSubmit={() => {
            dispatch({type: 'diffDlg'});
          }}
          onCancel={onHide}>
          <Text style={styles.labelText}>
            Внимние! Есть расхождения. Продолжить?
          </Text>
        </SimpleDlg>
      );
    case Steps.diffDlg:
      return (
        <PerNaklDiff
          data={state.diff ?? []}
          onCancel={onHide}
          onSubmit={() => endCloseNakl('', '')}
        />
      );

    case Steps.loginFrom:
      return (
        <LoginDlg
          title="Представитель зоны отгрузки"
          onSubmit={(login, passw) => {
            dispatch({type: 'userFrom', user: {login, passw}});
          }}
          onCancel={onHide}
          key="1"
          active={true}
        />
      );
    case Steps.kppDlg:
      return (
        <SimpleDlg>
          <Text style={styles.labelText}>{'Документ прошел КПП '}</Text>
          <Text style={styles.labelText}>{state.KppInfo}</Text>
          <Text style={styles.labelText}>
            Расхождений нет. Возможно закрытие без представителя ТЗ. Закрыть
            документ?
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <SimpleButton
              text={'Без сдающего (' + state.UserKpp + ')'}
              containerStyle={styles.buttonStyleV}
              onPress={() => endCloseNakl(state.UserKpp, '')}
            />
            <SimpleButton
              text="Другой сотр. (ввод логина)"
              containerStyle={styles.buttonStyleV}
              onPress={() => {
                dispatch({type: 'getUserTo'});
              }}
            />
          </View>
        </SimpleDlg>
      );
    case Steps.loginTo:
      return (
        <LoginDlg
          title={
            state.UseSkl === 'true'
              ? 'Представитель склада'
              : 'Представитель торгового зала'
          }
          onSubmit={(uid, pass) => {
            endCloseNakl(uid, pass);
          }}
          onCancel={onHide}
          key="2"
          active={!state.isLoading}
        />
      );
    default:
      return (
        <SimpleDlg onCancel={onHide}>
          <Text style={styles.simpleText}>Ошибка статуса...</Text>
        </SimpleDlg>
      );
  }
};

export default PerNaklClose;

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
