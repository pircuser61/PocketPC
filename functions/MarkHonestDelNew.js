import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function MarkHonestDel(
  ParentId = '',
  IdNum = '',
  DocType = '',
  MarkId = '',
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
          gate2prog: 'MarkHonestDel,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<MarkHonestDel>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<DocType>' +
            DocType +
            '</DocType>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' +
            '<ParentId>' +
            ParentId +
            '</ParentId>' +
            '<MarkId>' +
            MarkId +
            '</MarkId>' +
            '</MarkHonestDel>',
          wantDbTo: 'ges-local',
        },
      });
      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
            Начинается запрос в функции PocketPrPda1 (Начало работы с накладной)
            C параметрами:
            City: ${City}
            UID : ${UID}
            IdNum: ${IdNum}
            MarkId: ${MarkId}
            По ссылке: ${soapRequest.requestURL}
            XML ЗАПРОС В ФУНКЦИИ PocketPrPda1: \n${soapRequest.xmlRequest}
            `,

        '\x1b[0m',
      );
      soapRequest
        .sendRequest()
        .then(response => {
          !response ? fail('Ответ от сервера не пришел') : null;
          if (
            response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['SOAP-ENV:Fault']
          ) {
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
              if (responseXMLJS.MarkHonestDel.$.Error === 'False') {
                console.log(
                  '\x1b[32m',
                  'Функция MarkHonestDel отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );

                success(true);
              }
              if (responseXMLJS.MarkHonestDel.$.Error === 'True') {
                fail(responseXMLJS.MarkHonestDel.Error);
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
