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

import PerNaklDiff, {Diff} from './PerNaklDiff';

enum Steps {
  ask,
  loginFrom,
  kppDlg,
  loginTo,
  diffDlg,
  hasAkt,
  err,
  warning,
}

export type NaklInfo = {
  PerZo: string;
  Closed: string;
  UseSkl: string;
  UserFrom: string;
  UserTo: string;
  UserKpp: string;
  KppInfo: string;
  AktDiff?: string;
};

type Response = NaklInfo & {Diff: Diff};

type State = {
  step: Steps;
  isLoading: boolean;
  PassFrom: string;
  errText?: string;
  diff?: Diff;
} & NaklInfo;

type Action = {
  type: string;
  user?: {login: string; passw: string};
  response?: Response;
  value?: string;
  num_value?: number;
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
  console.log('\x1b[31m', 'REDUSER: ' + action.type + ' ' + action);

  state.isLoading = false;
  switch (action.type) {
    case 'requestError':
      return {...state};
    case 'request':
      return {...state, isLoading: true};
    case 'response': {
      if (action.response?.PerZo === 'true') {
        let newState = {...state, ...action.response};
        if (!newState.UserFrom) newState.step = Steps.loginFrom;
        else newState.step = newState.UserKpp ? Steps.kppDlg : Steps.loginTo;
        return newState;
      }

      if (action.response?.Diff) {
        //console.log('\x1b[31m', 'RESOPNSE DIFF');
        //console.log(action.response.Diff.Reason.ReasonRow);
        //
        var obj: {[key: string]: string} = {};
        action.response.Diff.Reason.ReasonRow.map((val, _) => {
          obj[val.Cod] = val.Name;
        });
        action.response.Diff.ReasonDict = obj;

        return {
          ...state,
          step: Steps.diffDlg,
          diff: action.response.Diff ?? [],
        };
      }

      if (action.response?.AktDiff === 'true') {
        return {...state, step: Steps.hasAkt};
      }

      alertMsg('?????????????????? ???? ??????????????!');
      return {...state, step: Steps.ask};
    }
    case 'getUserFrom':
      return {...state, step: Steps.loginFrom};
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
    case 'diffDlgOk':
      return {...state, step: Steps.loginFrom};

    default:
      return {
        ...state,
        step: Steps.err,
        errText: 'unsupported action: ' + action.type,
      };
  }
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
    arrayAccessFormPaths: [
      'PocketPerClose.Diff.Palett',
      'PocketPerClose.Diff.Palett.PalettRow',
      'PocketPerClose.Diff.Reason.ReasonRow',
    ],
  };

  //console.log('\x1b[34m', 'RENDER');
  //console.log(state);

  const checkUid = async (User: string, passw: string) => {
    try {
      dispatch({type: 'request'});
      const req = {
        User,
        Passw: md5(passw),
      };

      const response: {} = await request('PocketCheckLogin', req);
      console.log('CHECK UID');
      console.log(response);
    } catch (error) {
      dispatch({type: 'requestError'});
    }
  };

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
        Object.assign(req, {PerNaklDiff: {PerNaklDiffRow: state.diff.Palett}});
      }
      const response: Response = await request(
        'PocketPerClose',
        req,
        parseParam,
      );
      if (response.Closed === 'true') {
        exitWithMsg('?????????????????? ??????????????');
      } else {
        throw Error('?????????????????? ???? ??????????????!');
      }
    } catch (error) {
      if (isMounted.current) alertError(error);
      dispatch({type: 'requestError'});
      // onHide();
    }
  };

  const tryCloseNakl = async () => {
    try {
      dispatch({type: 'request'});

      const response: Response = await request(
        'PocketPerClose',
        {
          numNakl,
          DeviceName: UserStore.user?.deviceName,
          NoError: 'true',
        },
        parseParam,
      );
      if (response.Closed === 'true') {
        exitWithMsg('?????????????????? ??????????????');
      } else {
        dispatch({type: 'response', response});
      }
    } catch (error) {
      if (isMounted.current) alertError(error);
      onHide();
    }
  };

  switch (state.step) {
    case Steps.err:
      return (
        <SimpleDlg onCancel={onHide}>
          <Text style={styles.labelText}>???????????????????????????? ????????????</Text>
          <Text style={styles.labelText}>{state.errText}</Text>
        </SimpleDlg>
      );
    case Steps.warning:
      return (
        <SimpleDlg
          onSubmit={() => {
            dispatch();
          }}
          onCancel={onHide}>
          <Text style={styles.labelText}>???????????????????????????? ????????????</Text>
          <Text style={styles.labelText}>{state.errText}</Text>
        </SimpleDlg>
      );
    case Steps.ask:
      return (
        <SimpleDlg onSubmit={tryCloseNakl} onCancel={onHide}>
          <Text style={styles.labelText}>
            {'?????????????? ?????????????????? ' + numNakl + '?'}
          </Text>
        </SimpleDlg>
      );

    case Steps.diffDlg:
      return (
        <PerNaklDiff
          onSubmit={() => {
            dispatch({type: 'diffDlgOk'});
          }}
          onCancel={onHide}
          data={state.diff!}
        />
      );

    case Steps.hasAkt:
      return (
        <SimpleDlg
          onSubmit={() => {
            dispatch({type: 'getUserFrom'});
          }}
          onCancel={onHide}>
          <Text style={styles.labelText}>
            ???????? ?????? ????????????????????????????/?????????? ?? ??????????????????!
          </Text>
          <Text style={styles.labelText}>
            ?????????????????? ???? ?????????????? ????????/????????????...
          </Text>
        </SimpleDlg>
      );
    case Steps.loginFrom:
      return (
        <LoginDlg
          title={
            state.PerZo
              ? '?????????????????????????? ???????? ????????????????'
              : '?????????????????????????? ?????????????? ??????????????'
          }
          onSubmit={(login, passw) => {
            dispatch({type: 'request'});
            checkUid(login, passw); // ???????????????? ???????????????? ?????????????????? ???? ????????????, ?? ???????????????????? ???? ?????????? ??????????????....??
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
          <Text style={styles.labelText}>{'???????????????? ???????????? ?????? '}</Text>
          <Text style={styles.labelText}>{state.KppInfo}</Text>
          <Text style={styles.labelText}>
            ?????????????????????? ??????. ???????????????? ???????????????? ?????? ?????????????????????????? ????. ??????????????
            ?????????????????
          </Text>
          <View style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
            <SimpleButton
              text={'?????? ???????????????? (' + state.UserKpp + ')'}
              containerStyle={styles.buttonStyleV}
              onPress={() => endCloseNakl(state.UserKpp, '')}
            />
            <SimpleButton
              text="???????????? ????????. (???????? ????????????)"
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
            state.PerZo
              ? state.UseSkl === 'true'
                ? '?????????????????????????? ????????????'
                : '?????????????????????????? ?????????????????? ????????'
              : '?????????????????????????? ?????????????????????? ??????????????'
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
          <Text style={styles.simpleText}>???????????? ??????????????...</Text>
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
