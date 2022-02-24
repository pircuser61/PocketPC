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
import {PocketProvperShopsProps} from '../types/types';

export async function PocketProvperShops({City = '', UID = ''}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketProvperShops', {
      City,
      UID,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvperShops,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvperShops',
      describe: 'Подразделение для выбора',
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

        // console.log(responseXML);

        const document: {
          PocketProvperShops: PocketProvperShopsProps;
        } = x2js.xml2js(responseXML);
        //console.log(JSON.stringify(document));

        if (document?.PocketProvperShops?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvperShops',
            document?.PocketProvperShops?.Error,
          );
          throw document?.PocketProvperShops?.Error;
        } else if (document?.PocketProvperShops?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvperShops');
          if (document.PocketProvperShops._row_count === '0') return [];
          else {
            if (Array.isArray(document.PocketProvperShops.Shops.ShopsRow)) {
              return document.PocketProvperShops.Shops.ShopsRow;
            } else {
              return [document.PocketProvperShops.Shops.ShopsRow];
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
