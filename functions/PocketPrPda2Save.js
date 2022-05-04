import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrPda2Save(
  nn = '',
  barcode = '',
  Qty = '',
  palletNumber = '',
  IdNum = '',
  CodGood = '',
  ParentId = '',
  dop = '',
  City = '',
  UserId = '',
) {
  //console.log(Qty);
  return new Promise((success, fail) => {
    try {
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate' + City + '/ws_gate',
      });

      console.log(soapRequest.requestURL);
      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketPrPda2Save,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrPda2Save>' +
            '<City>' +
            City +
            '</City>' +
            '<Uid>' +
            UserId +
            '</Uid>' +
            '<ParentId>' +
            ParentId +
            '</ParentId>' +
            '<NumPal>' +
            palletNumber +
            '</NumPal>' +
            '<NN>' +
            nn +
            '</NN>' +
            '<BarCod>' +
            barcode +
            '</BarCod>' +
            '<CodGood>' +
            CodGood +
            '</CodGood>' +
            '<Quantity>' +
            Qty +
            '</Quantity>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' +
            '<DOP>' +
            dop +
            '</DOP>' +
            '</PocketPrPda2Save>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrPda2Save (Сохранение товара в накладную)
      C параметрами:
      City: ${City}
      ParentId: ${ParentId}
      palletNumber: ${palletNumber}
      nn: ${nn}
      barcode: ${barcode}
      CodGood: ${CodGood}
      Qty: ${Qty}
      IdNum: ${IdNum}
      dop: ${dop}

      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPrBarInfo: \n${soapRequest.xmlRequest}
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
              if (responseXMLJS.PocketPrPda2Save.$.Error === 'False') {
                console.log(responseXMLJS.PocketPrPda2Save);
                success(responseXMLJS.PocketPrPda2Save);
              }

              if (responseXMLJS.PocketPrPda2Save.$.Error === 'True') {
                fail(responseXMLJS.PocketPrPda2Save.Error[0]);
              }
            });
          }
          fail('Произошла ошибка');
        })
        .catch(error => {
          fail('' + error);
        });
    } catch (error) {
      fail('' + error);
    }
  });
}
