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
import {PocketProvSpecsListProps} from '../types/types';

export async function PocketProvSpecsList({
  City = '',
  UID = '',
  Type = '',
  NumNakl = '',
  Shop = '',
  Flag = '',
}) {
  try {
    // await timeout(3000);
    // throw 'test';
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    /**
 * <PocketProvSpecsList>              
    <City>1</City>             
    <UID>9604</UID>            
    <Type>6</Type>             
    <NumNakl>79556976</NumNakl>
    <Shop>701</Shop>           
</PocketProvSpecsList> 
 */

    let request_body = createXMLByObject('PocketProvSpecsList', {
      City,
      UID,
      Type,
      NumNakl,
      Shop,
      Flag,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvSpecsList,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvSpecsList ' + Type,
      describe: 'Получить список паллет у конкртеной проверки',
      url: soapRequest.requestURL,
    });

    //await timeout(1000);
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
          PocketProvSpecsList: PocketProvSpecsListProps;
        } = x2js.xml2js(responseXML);

        if (document?.PocketProvSpecsList?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvSpecsList',
            document?.PocketProvSpecsList?.Error,
          );
          throw document?.PocketProvSpecsList?.Error;
        } else if (document?.PocketProvSpecsList?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvSpecsList');

          if (!document.PocketProvSpecsList.ProvPalSpecs.ProvPalSpecsRow)
            return [];
          else {
            if (
              Array.isArray(
                document.PocketProvSpecsList.ProvPalSpecs.ProvPalSpecsRow,
              )
            ) {
              return document.PocketProvSpecsList.ProvPalSpecs.ProvPalSpecsRow;
            } else {
              return [
                document.PocketProvSpecsList.ProvPalSpecs.ProvPalSpecsRow,
              ];
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
