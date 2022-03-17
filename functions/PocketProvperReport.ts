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
import {PocketProvperReportProps} from '../types/types';

export async function PocketProvperReport({City = '', UID = '', NumProv = ''}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    /**
 * <PocketProvperReport>              
    <City>1</City>             
    <UID>9604</UID>            
    <Type>6</Type>             
    <NumNakl>79556976</NumNakl>
    <Shop>701</Shop>           
</PocketProvperReport> 
 */

    let request_body = createXMLByObject('PocketProvperReport', {
      City,
      UID,
      NumProv,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvperReport,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvperReport',
      describe: 'Получить отчет в проверке накладных',
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
          PocketProvperReport: PocketProvperReportProps;
        } = x2js.xml2js(responseXML);

        if (document?.PocketProvperReport?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvperReport',
            document?.PocketProvperReport?.Error,
          );
          throw document?.PocketProvperReport?.Error;
        } else if (document?.PocketProvperReport?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvperReport');
          return document.PocketProvperReport;
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
