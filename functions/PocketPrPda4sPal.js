import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrPda4sPal(
  IdNum = '',
  ListPal = [],
  UID = '',
  City = '',
) {
  return new Promise((success, fail) => {
    let ListPalStr = '';
    ListPal.filter(r => r.palletNumber && r.palletNumber !== '0').map(r => {
      console.log(r);
      ListPalStr =
        ListPalStr +
        '<Palett>' +
        '<NumPal>' +
        r.palletNumber +
        '</NumPal>' +
        '<CodOb>' +
        r.cod_ob[0] +
        '</CodOb>' +
        '</Palett>';
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
          gate2prog: 'PocketPrPda4sPal,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrPda4sPal>' +
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
            ListPalStr +
            '</ListPal>' +
            '</PocketPrPda4sPal>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrPda4sPal (Задание списка паллет)
      C параметрами:
      IdNum: ${IdNum}
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPrPda4sPal: \n${soapRequest.xmlRequest}
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
              if (responseXMLJS.PocketPrPda4sPal.$.Error === 'False') {
                console.log(
                  '\x1b[32m',
                  'Функция PocketPrPda4sPal отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );

                success(true);
              }
              if (responseXMLJS.PocketPrPda4sPal.$.Error === 'True') {
                fail(responseXMLJS.PocketPrPda4sPal.Error[0]);
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
