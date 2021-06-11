import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrPda4sSave(
  ParentId = '',
  IdNum = '',
  CodGood = '',
  BarCod = '',
  ListPal = [],
  DOP = '',
  UID = '',
  City = '',
) {
  return new Promise((success, fail) => {
    try {
      let ListPalStr = '';
      let ListQtyStr = '';
      console.log(ListPal);

      ListPal.filter(r => r.checked).map(item => {
        let qty =
          item.qty && item.qty !== 0 ? item.qty.replaceAll(' ', '') : '0';

        ListPalStr = ListPalStr + item.palletNumber + ',';
        ListQtyStr = ListQtyStr + qty + ',';
      });

      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate' + City + '/ws_gate',
      });

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketPrPda4sSave,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrPda4sSave>' +
            '<City>' +
            City +
            '</City>' +
            '<ParentId>' +
            ParentId +
            '</ParentId>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' +
            ' <CodGood>' +
            CodGood +
            '</CodGood>' +
            '<BarCod>' +
            BarCod +
            '</BarCod>' +
            ' <ListPal>' +
            ListPalStr.slice(0, -1) +
            '</ListPal>' +
            '<ListQty>' +
            ListQtyStr.slice(0, -1) +
            '</ListQty>' +
            '<NoLabel>false</NoLabel>' +
            '<DOP>' +
            DOP +
            '</DOP>' +
            '</PocketPrPda4sSave>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrPda4sSave (Получение строки спецификации)
      C параметрами:
    
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPrPda4sSave: \n${soapRequest.xmlRequest}
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
              if (responseXMLJS.PocketPrPda4sSave.$.Error === 'False') {
                console.log(responseXMLJS.PocketPrPda4sSave.MarkReqd[0]);
                success({
                  IdNum: responseXMLJS.PocketPrPda4sSave.IdNum[0],
                  MarkReqd: responseXMLJS.PocketPrPda4sSave.MarkReqd[0],
                });

                console.log(
                  '\x1b[32m',
                  'Функция PocketPrPda4sSave отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );
              }
              if (responseXMLJS.PocketPrPda4sSave.$.Error === 'True') {
                fail(responseXMLJS.PocketPrPda4sSave.Error[0]);
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
