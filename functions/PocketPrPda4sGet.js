import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrPda4sGet(
  ParentId = '',
  IdNum = '',
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
          gate2prog: 'PocketPrPda4sGet,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrPda4sGet>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' +
            '<ParentId>' +
            ParentId +
            '</ParentId>' +
            '</PocketPrPda4sGet>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrPda4sGet (Получение строки спецификации)
      C параметрами:
    
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPrPda4sGet: \n${soapRequest.xmlRequest}
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
              if (responseXMLJS.PocketPrPda4sGet.$.Error === 'False') {
                success({
                  BarCod: responseXMLJS.PocketPrPda4sGet.BarCod
                    ? responseXMLJS.PocketPrPda4sGet.BarCod[0]
                    : '',
                  CodGood: responseXMLJS.PocketPrPda4sGet.CodGood
                    ? responseXMLJS.PocketPrPda4sGet.CodGood[0]
                    : '',
                  DOP: responseXMLJS.PocketPrPda4sGet.DOP
                    ? responseXMLJS.PocketPrPda4sGet.DOP[0]
                    : '',
                  DateErr: responseXMLJS.PocketPrPda4sGet.DateErr
                    ? responseXMLJS.PocketPrPda4sGet.DateErr[0]
                    : '',
                  DateWarn: responseXMLJS.PocketPrPda4sGet.DateWarn
                    ? responseXMLJS.PocketPrPda4sGet.DateWarn[0]
                    : '',
                  IdNum: responseXMLJS.PocketPrPda4sGet.IdNum
                    ? responseXMLJS.PocketPrPda4sGet.IdNum[0]
                    : '',
                  ListPal: responseXMLJS.PocketPrPda4sGet.ListPal
                    ? responseXMLJS.PocketPrPda4sGet.ListPal[0]
                    : '',
                  ListQty: responseXMLJS.PocketPrPda4sGet.ListQty
                    ? responseXMLJS.PocketPrPda4sGet.ListQty[0]
                    : '',
                  ListUpak: responseXMLJS.PocketPrPda4sGet.ListUpak
                    ? responseXMLJS.PocketPrPda4sGet.ListUpak[0]
                    : '',
                  MonthLife: responseXMLJS.PocketPrPda4sGet.MonthLife
                    ? responseXMLJS.PocketPrPda4sGet.MonthLife[0]
                    : '',
                  NoLabel: responseXMLJS.PocketPrPda4sGet.NoLabel
                    ? responseXMLJS.PocketPrPda4sGet.NoLabel[0]
                    : '',
                  MarkReqd: responseXMLJS.PocketPrPda4sGet.MarkReqd
                    ? responseXMLJS.PocketPrPda4sGet.MarkReqd[0]
                    : '',
                });

                console.log(
                  '\x1b[32m',
                  'Функция PocketPrPda4sGet отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );
              }
              if (responseXMLJS.PocketPrPda4sGet.$.Error === 'True') {
                fail(responseXMLJS.PocketPrPda4sGet.Error[0]);
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
