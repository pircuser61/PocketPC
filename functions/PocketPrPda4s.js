import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrPda4s(
  IdNum = '',
  ListPal = [],
  UID = '',
  City = '',
) {
  return new Promise((success, fail) => {
    let ListPalStr = '';
    ListPal.filter(r => r.palletNumber && r.palletNumber !== '0').map(r => {
      ListPalStr = ListPalStr + r.palletNumber + ',';
    });
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
          gate2prog: 'PocketPrPda4s,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrPda4s>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' +
            '<ListPal>' +
            ListPalStr.slice(0, -1) +
            '</ListPal>' +
            '</PocketPrPda4s>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrPda4s (Задание списка паллет)
      C параметрами:
    
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPrPda4s: \n${soapRequest.xmlRequest}
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
              // console.log(JSON.stringify(responseXMLJS["PocketPrPda2"]['rows']))
              //console.log(responseXMLJS);
              if (responseXMLJS.PocketPrPda4s.$.Error === 'False') {
                console.log(
                  '\x1b[32m',
                  'Функция PocketPrPda4s отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );

                if (responseXMLJS.PocketPrPda4s.rows[0])
                  success(responseXMLJS.PocketPrPda4s.rows[0].row);
                else success([]);
              }
              if (responseXMLJS.PocketPrPda4s.$.Error === 'True') {
                fail(responseXMLJS.PocketPrPda4s.Error[0]);
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
