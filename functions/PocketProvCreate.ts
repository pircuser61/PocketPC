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
import UserStore from '../mobx/UserStore';

export async function PocketProvCreate({
  CodDep = '',
  Comment = '',
  CodShop = '',
  Type = '',
  UID = '',
  City = '',
  CodObTo = '0',
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
 * <City>1</City>          
    <UID>9604</UID>         
    <Type>6</Type>          
    <CodShop>701</CodShop> 
    <CodDep>1</CodDep>      
    <CodObTo>0</CodObTo>     <!-- Код объединения заполняется только для типа 7 -->     
    <Comment>TEST</Comment>
 */

    let request_body = '';

    if (Type === '7') {
      request_body = createXMLByObject('PocketProvCreate', {
        City,
        UID,
        Type,
        CodObTo,
        CodShop: UserStore.podrazd.Id,
      });
    } else
      request_body = createXMLByObject('PocketProvCreate', {
        City,
        UID,
        CodShop,
        Comment,
        Type,
        CodDep,
      });
    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvCreate,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvCreate ' + Type,
      describe: 'Создать новую проверку',
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
          PocketProvCreate: {_Error: string; Error: string; NumNakl: string};
        } = x2js.xml2js(responseXML);
        //console.log(document);

        if (document?.PocketProvCreate?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvCreate',
            document?.PocketProvCreate?.Error,
          );
          throw document?.PocketProvCreate?.Error;
        } else if (document?.PocketProvCreate?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvCreate');
          return document.PocketProvCreate.NumNakl;
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
