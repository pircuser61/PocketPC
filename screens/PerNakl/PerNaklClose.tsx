import React, {useEffect, useReducer} from 'react';
import {Modal, StyleSheet, Text, View} from 'react-native';
import LoginDlg from '../../components/SystemComponents/LoginDlg';
import SimpleButton from '../../components/SystemComponents/SimpleButton';
import request from '../../soap-client/pocketRequest';
import {alertMsg, alertError} from '../../constants/funcrions';
//@ts-ignore
import md5 from 'md5';
import UserStore from '../../mobx/UserStore';

enum Steps {
  ask,
  loginFrom,
  kppDlg,
  loginTo,
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

type State = {
  step: Steps;
  isLoading: boolean;
  PassFrom: string;
} & NaklInfo;

type Action = {
  type: string;
  user?: {login: string; passw: string};
  response?: NaklInfo;
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

const PerNaklClose = ({
  numNakl,
  onHide,
}: {
  numNakl: string;
  onHide: () => void;
}) => {
  function reducer(state: State, action: Action): State {
    state.isLoading = false;
    switch (action.type) {
      case 'request':
        return {...state, isLoading: true};
      case 'response': {
        let newState = {...state, ...action.response};
        if (!newState.UserFrom) newState.step = Steps.loginFrom;
        else newState.step = newState.UserKpp ? Steps.kppDlg : Steps.loginTo;
        return newState;
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
      default:
        exitWithMsg('unsupported action: ' + action.type);
    }
    return initState; // never
  }

  const [state, dispatch] = useReducer(reducer, initState);

  console.log('view ' + Date.now());

  let isMounted = true;
  useEffect(() => {
    return () => {
      isMounted = false;
    };
  }, []);

  const exitWithMsg = (msg: string) => {
    alertMsg(msg);
    onHide();
  };

  const endCloseNakl = async (userTo: string, passwTo: string) => {
    try {
      dispatch({type: 'request'});
      const response: NaklInfo = await request('PocketPerClose', {
        numNakl,
        DeviceName: UserStore.user?.deviceName,
        userFrom: state.UserFrom,
        passwFrom: md5(state.PassFrom),
        userTo,
        passwTo: md5(passwTo),
      });
      if (response.Closed === 'true') {
        exitWithMsg('Накладная закрыта');
      } else {
        throw Error('Накладная НЕ закрыта!');
      }
    } catch (error) {
      alertError(error);
      onHide();
    }
  };

  const tryCloseNakl = async () => {
    try {
      dispatch({type: 'request'});
      const response: NaklInfo = await request('PocketPerClose', {
        numNakl,
        DeviceName: UserStore.user?.deviceName,
        NoError: 'true',
      });
      if (response.Closed === 'true') {
        exitWithMsg('Накладная закрыта');
      } else {
        if (response.PerZo === 'true') {
          dispatch({type: 'response', response});
        } else {
          throw Error('Накладная НЕ закрыта!');
        }
      }
    } catch (error) {
      alertError(error);
      onHide();
    }
  };

  return (
    <>
      {state.step === Steps.ask ? (
        <Modal transparent={true}>
          <View style={styles.shadowView}>
            <View style={styles.background}>
              <Text style={styles.labelText}>
                {'Закрыть накладную ' + numNakl + '?'}
              </Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
                <SimpleButton
                  text="Ок"
                  containerStyle={styles.buttonStyle}
                  onPress={tryCloseNakl}
                  active={!state.isLoading}
                />
                <SimpleButton
                  text="Отмена"
                  containerStyle={styles.buttonStyle}
                  onPress={onHide}
                  active={!state.isLoading}
                />
              </View>
            </View>
          </View>
        </Modal>
      ) : state.step === Steps.loginFrom ? (
        <LoginDlg
          title="Представитель зоны отгрузки"
          onSubmit={(login, passw) => {
            dispatch({type: 'userFrom', user: {login, passw}});
          }}
          onCancel={onHide}
          key="1"
          active={true}
        />
      ) : state.step === Steps.kppDlg ? (
        <Modal transparent={true}>
          <View style={styles.shadowView}>
            <View style={styles.background}>
              <Text style={styles.labelText}>
                {'Документ прошел КПП ' + state.KppInfo}
              </Text>
              <Text style={styles.labelText}>
                Расхождений нет. Возможно закрытие без представителя ТЗ. Закрыть
                документ?
              </Text>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-evenly'}}>
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
            </View>
          </View>
        </Modal>
      ) : state.step === Steps.loginTo ? (
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
      ) : (
        <Modal transparent={true}>
          <View style={styles.shadowView}>
            <View style={styles.background}>
              <Text style={styles.simpleText}>Ошибка статуса...</Text>
              <SimpleButton
                text="Отмена"
                containerStyle={styles.buttonStyle}
                onPress={onHide}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
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
