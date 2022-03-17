import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {toUTF8Array} from './checkTypes';
import X2JS from 'x2js';
import {convertToXML, createXMLByObject, x2js} from '../constants/funcrions';

export async function CrossDockCheck(
  NumNakl = '',
  XdType = '',
  UID = '',
  City = '',
) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('CrossDockCheck', {
      City,
      XdType,
      NumNakl,
      UID,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'CrossDockCheck,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    console.log(
      '\x1b[36m',
      `\n<----------------------------------------------------------------------->
            Начинается запрос в функции CrossDockCheck ( Добавление кода маркировки в накладную )
            C параметрами:
            City: ${City}
            UID: ${UID}
            XdType: ${XdType}
            По ссылке: ${soapRequest.requestURL}
            XML ЗАПРОС В ФУНКЦИИ CrossDockCheck: \n${soapRequest.xmlRequest}
            `,

      '\x1b[0m',
    );

    let response = await soapRequest.sendRequest();
    if (!response) {
      throw 'Пришел пустой ответ';
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

      let json = x2js.xml2js(responseXML);
      if (json?.CrossDockCheck?._Error === 'False') {
        if (json?.CrossDockCheck?.Ready === 'false') {
          if (json?.CrossDockCheck?.Palett?.PalettRow) {
            console.log(json?.CrossDockCheck?.Palett?.PalettRow);
            return json?.CrossDockCheck?.Palett?.PalettRow;
          }
        }
        if (json?.CrossDockCheck?.Ready === 'true') {
          throw 'Все паллеты отгружены!';
        }
      }

      if (json?.CrossDockCheck?._Error === 'True') {
        throw json.CrossDockCheck.Error;
      }
    }

    throw 'Неизвестная ошибка';
  } catch (error) {
    throw error;
  }
}

/**
 *  {"CrossDockIn":[{"NumNakl":"85861534","SuplierCod":"271113"},{"NumNakl":"85861535","SuplierCod":"19154"}],"_DTTM":"06.10.21 11:12:08","_Error":"False"}
 */
