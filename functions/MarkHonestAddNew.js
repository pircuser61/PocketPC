import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {toUTF8Array} from './checkTypes';

export async function MarkHonestAdd(
  ParentId = '',
  IdNum = '',
  DocType = '',
  QR = '',
  UID = '',
  City = '',
) {
  return new Promise((success, fail) => {
    try {
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate' + City + '/ws_gate',
      });

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'MarkHonestAdd,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<MarkHonestAdd>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<DocType>' +
            DocType +
            '</DocType>' +
            '<ParentId>' +
            ParentId +
            '</ParentId>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' +
            '<QR>' +
            QR.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .split('')
              .map(r => {
                if (toUTF8Array(r) == 29) {
                  return '&#x001d;';
                } else return r;
              })
              .join('') +
            '</QR>' +
            '</MarkHonestAdd>',
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
      soapRequest
        .sendRequest()
        .then(response => {
          !response ? fail('Пришел пустой ответ') : null;
          if (
            response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['SOAP-ENV:Fault']
          ) {
            console.log(JSON.stringify(response));
            fail('Ошибка ответа');
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
            parseString(responseXML, (err, responseXMLJS) => {
              if (responseXMLJS.MarkHonestAdd.$.Error === 'False') {
                console.log(
                  '\x1b[32m',
                  'Функция MarkHonestAdd отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );
                success(true);
              }
              if (responseXMLJS.MarkHonestAdd.$.Error === 'True') {
                fail(responseXMLJS.MarkHonestAdd.Error);
              }
            });
          }
          fail('Произошла неизвестная ошибка');
        })
        .catch(error => {
          fail('' + error);
        });
    } catch (error) {
      fail('' + error);
    }
  });
}
