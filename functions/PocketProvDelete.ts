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

export async function PocketProvDelete({
  NumNakl = '',
  Shop = '',
  Type = '',
  UID = '',
  City = '',
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });
    let request_body = createXMLByObject('PocketProvDelete', {
      City,
      UID,
      NumNakl,
      Type,
    });
    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvDelete,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvDelete ' + Type,
      describe: 'Удалить проверку на покете',
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
          PocketProvDelete: {_Error: string; Error: string};
        } = x2js.xml2js(responseXML);

        if (document?.PocketProvDelete?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvDelete',
            document?.PocketProvDelete?.Error,
          );
          throw document?.PocketProvDelete?.Error;
        } else if (document?.PocketProvDelete?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvDelete');
          return true;
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
