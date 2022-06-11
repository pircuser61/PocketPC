import {Alert, Dimensions, Vibration} from 'react-native';
import RNBeep from 'react-native-a-beep';
import DataWedgeIntents from 'react-native-datawedge-intents';
import {DataProvider} from 'recyclerlistview';
import X2JS from 'x2js';

export const sendCommand = (extraName, extraValue) => {
  // console.log(
  //   'Посылается команда: ' + extraName + ', ' + JSON.stringify(extraValue),
  // );
  let broadcastExtras = {};
  broadcastExtras[extraName] = extraValue;
  broadcastExtras['SEND_RESULT'] = false;
  DataWedgeIntents.sendBroadcastWithExtras({
    action: 'com.symbol.datawedge.api.ACTION',
    extras: broadcastExtras,
  });
};

export const data_provider = list => {
  return new DataProvider((r1, r2) => {
    return r1 !== r2;
  }).cloneWithRows(list.map((r, i) => ({...r, id: i + 1})));
};

export const TOGGLE_SCANNING = () => {
  sendCommand('com.symbol.datawedge.api.SOFT_SCAN_TRIGGER', 'TOGGLE_SCANNING');
};

export const TURN_ON_SCANNER = () => {
  sendCommand('com.symbol.datawedge.api.SOFT_SCAN_TRIGGER', 'START_SCANNING');
};

export const TURN_OFF_SCANNER = () => {
  sendCommand('com.symbol.datawedge.api.SOFT_SCAN_TRIGGER', 'STOP_SCANNING');
};

export const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export const alertActions = err => {
  Vibration.vibrate(200);
  RNBeep.beep(false);
  Alert.alert('Ошибка!', err + '');
};

export const alertMsg = (msg, title = 'Внимание!') => {
  Vibration.vibrate(200);
  RNBeep.beep(false);
  Alert.alert(title, msg);
};

export const alertError = err => {
  let msg = '';
  if (err instanceof Error) msg = err.message;
  else msg = err;
  Vibration.vibrate(200);
  RNBeep.beep(false);
  Alert.alert('Ошибка!', msg);
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

export const NEED_DEV_LOGS = true;

export const START_REQUEST_LOG = props => {
  props = {serviceName: '', describe: '', url: '', body: '', ...props};
  const {serviceName, describe, url, body} = props;
  if (NEED_DEV_LOGS)
    console.log(
      '\x1b[36m',
      `\n<----------------------------------------------------------------------->
  Начинается запрос в функции ${serviceName} (${describe})
  По ссылке: ${url}
  XML ЗАПРОС В ФУНКЦИИ ${serviceName}: \n ${body}`,
      '\x1b[0m',
    );
};

export const SUCCES_CONSOLE_LOG = (funcName = '') => {
  if (NEED_DEV_LOGS)
    console.log(
      '\x1b[32m',
      `Функция ${funcName} отработала нормально\n<----------------------------------------------------------------------->`,
      '\x1b[0m',
    );
};

export const ERROR_CONSOLE_LOG = (funcName = '', err = '') => {
  if (NEED_DEV_LOGS)
    console.log(
      '\x1b[31m',
      `\nПроизошла ошибка в функции ${funcName}\n${err}\n<----------------------------------------------------------------------->`,
      '\x1b[0m',
    );
};

export const ViewTypes = {
  FULL: 0,
  HALF_LEFT: 1,
  HALF_RIGHT: 2,
};

export const IS_DEV = true;

export const MAIN_COLOR = '#313C47';

export const x2js = new X2JS();

export const convertToXML = (str = '') => {
  return x2js.js2xml(str);
};

export const SCREEN_HEIGHT = Dimensions.get('screen').height;
export const SCREEN_WIDTH = Dimensions.get('screen').width;

const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;

function appendChild(xmlDoc, parentElement, name, text) {
  let childElement = xmlDoc.createElement(name);
  if (typeof text !== 'undefined' || text != '' || text || text !== null) {
    let textNode = xmlDoc.createTextNode(text);
    childElement.appendChild(textNode);
  }
  parentElement.appendChild(childElement);
  return childElement;
}

export function createXMLByObject(
  first_element = 'Empty',
  array_elements = {},
) {
  try {
    const xmlDoc = new DOMParser().parseFromString(
      `<${first_element}></${first_element}>`,
    );
    const rootElement = xmlDoc.documentElement;

    for (var key in array_elements) {
      if (array_elements[key] && array_elements[key].length > 0)
        appendChild(xmlDoc, rootElement, key, array_elements[key]);
    }

    const xmlSerializer = new XMLSerializer();
    const xmlOutput = xmlSerializer.serializeToString(xmlDoc);
    return xmlOutput;
  } catch (e) {
    console.log(e);
  }
}

export function timeout(ms = 0) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const BRIGHT_GREY = '#cfcfcf';

export const BACK_COLOR = '#f2f2f2';
