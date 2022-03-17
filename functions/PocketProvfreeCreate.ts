import SoapRequest from '../soap-client/soapclient';
// @ts-ignore
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {
  createXMLByObject,
  ERROR_CONSOLE_LOG,
  START_REQUEST_LOG,
  SUCCES_CONSOLE_LOG,
  x2js,
} from '../constants/funcrions';
import {Provfree} from './PocketProvfreeList';

export interface PocketProvfreeCreateAnswer {
  Provfree: Provfree;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error: string;
}

export async function PocketProvfreeCreate({
  City = '',
  UID = '',
  CurrShop = '',
  Comment = '',
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketProvfreeCreate', {
      City,
      UID,
      CurrShop,
      Comment,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvfreeCreate,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvfreeCreate',
      describe: 'Создать новую выкладку',
      url: soapRequest.requestURL,
    });

    let response = await soapRequest.sendRequest();
    if (!response) {
      throw 'Ответ от сервера не пришел!';
    } else {
      if (response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['SOAP-ENV:Fault']) {
        throw 'Ошибка ответа';
      }
      if (
        response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
          'ns1:ws_gateResponse'
        ][0]['xmlOut'][0]['_']
      ) {
        let responseXML =
          response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
            'ns1:ws_gateResponse'
          ][0]['xmlOut'][0]['_'];

        const document: {
          PocketProvfreeCreate: PocketProvfreeCreateAnswer;
        } = x2js.xml2js(responseXML);

        //console.log(JSON.stringify(document));

        if (document?.PocketProvfreeCreate?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvfreeCreate',
            document?.PocketProvfreeCreate?.Error,
          );
          throw document?.PocketProvfreeCreate?.Error;
        } else if (document?.PocketProvfreeCreate?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvfreeCreate');
          if (document.PocketProvfreeCreate._row_count === '0') {
            throw 'Проверка не создалась';
          } else if (document.PocketProvfreeCreate._row_count === '1') {
            return document.PocketProvfreeCreate.Provfree.ProvfreeRow;
          }
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
