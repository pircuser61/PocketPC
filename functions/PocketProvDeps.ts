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
import {PocketProvDepsProps} from '../types/types';

export async function PocketProvDeps({
  City = '1',
  UID = '9604',
  Type = '6',
  NumNakl = '79556976',
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketProvDeps', {
      City,
      UID,
      Type,
      NumNakl,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvDeps,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvDeps ' + Type,
      describe: 'Получить список паллет у конкртеной проверки',
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
          PocketProvDeps: PocketProvDepsProps;
        } = x2js.xml2js(responseXML);
        console.log(JSON.stringify(document));

        if (document?.PocketProvDeps?._Error == 'True') {
          ERROR_CONSOLE_LOG('PocketProvDeps', document?.PocketProvDeps?.Error);
          throw document?.PocketProvDeps?.Error;
        } else if (document?.PocketProvDeps?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvDeps');
          if (document.PocketProvDeps._row_count === '0') return [];
          else {
            if (Array.isArray(document.PocketProvDeps.Depart.DepartRow)) {
              return document.PocketProvDeps.Depart.DepartRow;
            } else {
              return [document.PocketProvDeps.Depart.DepartRow];
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
