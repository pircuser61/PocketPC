import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {toUTF8Array} from './checkTypes';
import X2JS from 'x2js';
import {convertToXML, createXMLByObject, x2js} from '../constants/funcrions';

export async function MarkHonestAdd(
  ParentId = '',
  IdNum = '',
  DocType = '',
  QR = '',
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

    let request_body = createXMLByObject('MarkHonestAdd', {
      City,
      UID,
      DocType,
      ParentId,
      IdNum,
      QR: QR.split('')
        .map(r => {
          if (toUTF8Array(r) == 29) {
            console.log(toUTF8Array(r));
            return '&#x001d;';
          } else return r;
        })
        .join(''),
    });

    request_body = request_body.replaceAll('&amp;#x001d;', '&#x001d;');

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'MarkHonestAdd,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    console.log(
      '\x1b[36m',
      `\n<----------------------------------------------------------------------->
            Начинается запрос в функции MarkHonestAdd ( Добавление кода маркировки в накладную )
            C параметрами:
            City: ${City}
            UID: ${UID}
            ParentId: ${ParentId}
            IdNum: ${IdNum}
            QR: ${QR}
            По ссылке: ${soapRequest.requestURL}
            XML ЗАПРОС В ФУНКЦИИ MarkHonestAdd: \n${soapRequest.xmlRequest}
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
      if (json?.MarkHonestAdd?._Error === 'False') {
        return true;
      }
      if (json?.MarkHonestAdd?._Error === 'True') {
        throw json.MarkHonestAdd.Error;
      }
    }

    throw 'Неизвестная ошибка';
  } catch (error) {
    throw error;
  }
}
