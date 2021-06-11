import {Vibration} from 'react-native';
import RNBeep from 'react-native-a-beep';
import DataWedgeIntents from 'react-native-datawedge-intents';

export const sendCommand = (extraName, extraValue) => {
  console.log(
    'Посылается команда: ' + extraName + ', ' + JSON.stringify(extraValue),
  );
  let broadcastExtras = {};
  broadcastExtras[extraName] = extraValue;
  broadcastExtras['SEND_RESULT'] = false;
  DataWedgeIntents.sendBroadcastWithExtras({
    action: 'com.symbol.datawedge.api.ACTION',
    extras: broadcastExtras,
  });
};

export const TOGGLE_SCANNING = () => {
  sendCommand('com.symbol.datawedge.api.SOFT_SCAN_TRIGGER', 'TOGGLE_SCANNING');
};

export const TURN_ON_SCANNER = () => {
  sendCommand('com.symbol.datawedge.api.SOFT_SCAN_TRIGGER', 'START_SCANNING');
};

export const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export const alertActions = err => {
  Vibration.vibrate(500);
  RNBeep.beep(false);
  alert(err);
};

export let _strSPLITANDCOMPARE = str1 => {
  let newStr1 = '';
  if (str1[2] === '.') {
    let newstr = str1.split('.');
    newStr1 = `${newstr[0]}/${newstr[1]}/${newstr[2]}`;
  } else {
    let newstr = str1.split('/');
    newStr1 = `${newstr[0]}/${newstr[1]}/${newstr[2]}`;
  }
  return newStr1;
};

export const NEED_DEV_LOGS = false;

export const SUCCES_CONSOLE_LOG = (funcName = '') => {
  console.log(
    '\x1b[32m',
    `Функция ${funcName} отработала нормально\n<----------------------------------------------------------------------->`,
    '\x1b[0m',
  );
};

export const ERROR_CONSOLE_LOG = (funcName = '', err = '') => {
  console.log(
    '\x1b[31m',
    `\nПроизошла ошибка в функции ${funcName}\n${err}\n<----------------------------------------------------------------------->`,
    '\x1b[0m',
  );
};

export const IS_DEV = false;
