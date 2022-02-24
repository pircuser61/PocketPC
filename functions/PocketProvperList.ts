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
import {PocketProvperListProps} from '../types/types';

export async function PocketProvperList({
  City = '',
  UID = '',
  Type = '1',
  FilterShop = '',
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    /**
 * <PocketProvperList>              
    <City>1</City>             
    <UID>9604</UID>            
    <Type>6</Type>             
    <NumNakl>79556976</NumNakl>
    <Shop>701</Shop>           
</PocketProvperList> 
 */

    let request_body = createXMLByObject('PocketProvperList', {
      City,
      UID,
      Type,
      FilterShop,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvperList,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvperList ' + Type,
      describe: 'Получить список в проверке накладных',
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
          PocketProvperList: PocketProvperListProps;
        } = x2js.xml2js(responseXML);

        if (document?.PocketProvperList?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvperList',
            document?.PocketProvperList?.Error,
          );
          throw document?.PocketProvperList?.Error;
        } else if (document?.PocketProvperList?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvperList');
          if (document.PocketProvperList._row_count === '0') return [];
          else {
            if (Array.isArray(document.PocketProvperList.Provper.ProvperRow)) {
              return document.PocketProvperList.Provper.ProvperRow;
            } else {
              return [document.PocketProvperList.Provper.ProvperRow];
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
