import SoapRequest from '../soap-client/soapclient';
// @ts-ignore
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {
  createXMLByObject,
  ERROR_CONSOLE_LOG,
  START_REQUEST_LOG,
  SUCCES_CONSOLE_LOG,
  timeout,
  x2js,
} from '../constants/funcrions';
import {Alert} from 'react-native';

export interface ProvfreeRow {
  NumNakl: string;
  Comment: string;
  CodShop: string;
  Uid: string;
  Date: string;
}

export interface Provfree {
  ProvfreeRow: ProvfreeRow | ProvfreeRow[];
}

export interface PocketProvfreeListAnswer {
  Provfree: Provfree;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error: string;
}

export async function PocketProvfreeList({
  City = '',
  UID = '',
  CurrShop = '',
  FilterShop = '',
  FilterUid = '',
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketProvfreeList', {
      City,
      UID,
      CurrShop,
      FilterShop,
      FilterUid,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvfreeList,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvfreeList ',
      describe: 'Получить список в проверке выкладки',
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

        //console.log(responseXML);

        const document: {
          PocketProvfreeList: PocketProvfreeListAnswer;
        } = x2js.xml2js(responseXML);
        //console.log(JSON.stringify(document));

        if (document?.PocketProvfreeList?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvfreeList',
            document?.PocketProvfreeList?.Error,
          );
          throw document?.PocketProvfreeList?.Error;
        } else if (document?.PocketProvfreeList?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvfreeList');
          if (document.PocketProvfreeList._row_count === '0') return [];
          else {
            if (
              Array.isArray(document.PocketProvfreeList.Provfree.ProvfreeRow)
            ) {
              return document.PocketProvfreeList.Provfree.ProvfreeRow;
            } else {
              return [document.PocketProvfreeList.Provfree.ProvfreeRow];
            }
          }
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
