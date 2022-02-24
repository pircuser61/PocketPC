import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrPda2(
  palletNumber = '',
  IdNum = '',
  CodOb = '',
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

      //IdNum не нужен
      //код
      //IdNum<>

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketPrPda2,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrPda2>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' + //IDNUM suda
            '<NumPal>' +
            palletNumber +
            '</NumPal>' +
            '<CodOb>' +
            CodOb +
            '</CodOb>' +
            '</PocketPrPda2>',
          wantDbTo: 'ges-local',
        },
      });
      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrPda2 (Получения списка товаров в паллете)
      C параметрами:
      palletNumber: ${palletNumber}
      IdNum: ${IdNum}
      CodOb: ${CodOb}

      По ссылке: ${uri + '/ws_gate1/ws_gate'}
      XML ЗАПРОС В ФУНКЦИИ VZAK: \n${soapRequest.xmlRequest}
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
              if (responseXMLJS.PocketPrPda2.$.Error === 'False') {
                console.log(
                  '\x1b[32m',
                  'Функция PocketPrPda2 отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );
                success(responseXMLJS['PocketPrPda2']['rows'][0]);
              }

              if (responseXMLJS.PocketPrPda2.$.Error === 'True') {
                fail(responseXMLJS.PocketPrPda2.Error[0]);
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
