import SoapRequest from './soapclient';
import {uri} from '../connectInfo';
import X2JS from 'x2js';
import {createXMLByObject} from '../constants/funcrions';
import UserStore from '../mobx/UserStore';

const request = async (
  wsName: string,
  body: object,
  responseParserConfig?: any,
) => {
  const requestSettings = {
    City: UserStore.user?.['city.cod'],
    UID: UserStore.user?.UserUID,
  };

  const soapRequest = new SoapRequest({});

  const x2js = new X2JS(responseParserConfig);

  const request_body = createXMLByObject(wsName, {
    ...requestSettings,
    ...body,
  });
  /*
  console.log('REQUEST');
  console.log(request_body);
*/
  soapRequest.InitParams({
    targetNamespace: 'urn:gestori-gate:ws_gate',
    targetPrefix: 'urn',
    SoapAction: '',
    requestURL: uri + '/ws_gate' + requestSettings.City + '/ws_gate',
  });

  soapRequest.createRequest({
    'urn:ws_gate': {
      gate2prog: wsName + ',mobileGes',
      param4prog: request_body,
      wantDbTo: 'ges-local',
    },
  });

  const response_raw = await soapRequest.sendRequest();

  if (!response_raw) throw 'Ответ от сервера не пришел!';
  if (response_raw['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['SOAP-ENV:Fault'])
    throw 'Ошибка ответа "SOAP-ENV:Fault"';

  const response_xml =
    response_raw['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
      'ns1:ws_gateResponse'
    ][0]['xmlOut'][0]['_'];

  if (!response_xml) throw 'Получен пустой ответ. (нет xmlOut)';

  let response_json: any;
  try {
    response_json = x2js.xml2js(response_xml);
  } catch (error) {
    throw 'Ошибка извлечения тела ответа [1].';
  }
  if (!response_json) throw 'Ошибка извлечения тела ответа [2].';

  for (let key in response_json) {
    if (key === 'ReturnResponse') {
      let isErr = true;
      let errText = '';
      for (let x1 in response_json[key]) {
        if (x1 == '_Error') {
          isErr = response_json[key][x1] != 'False';
        } else if (x1 == 'ReturnMessage') {
          errText = response_json[key][x1];
        }
      }
      if (isErr)
        if (errText && errText.length > 0)
          // Допустим есть сервисы для которых ReturnResponse это норма
          throw errText;
        else 'Ошибка уровния прослойки.';
    }
    if (key === wsName) {
      const err: string = response_json[key]._Error;
      if (err.toLocaleLowerCase() != 'false') {
        const err_text: string = response_json[key].Error;
        if (err_text && err_text.length > 0) throw err_text;
        throw 'Сервис вернул пустую ошибку.';
      }
    } else throw 'Ожидался корневой элемент ' + wsName + ' получен ' + key;
  }
  /*
  console.log('RESPONSE');
  console.log(response_json);
*/
  return response_json[wsName];
};

export default request;
