import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrPda2Get(IdNum = '', City = '') {
  return new Promise((success, fail) => {
    try {
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate' + City + '/ws_gate',
      });

      //ParentID

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketPrPda2Get,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrPda2Get>' +
            '<City>' +
            City +
            '</City>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' +
            '</PocketPrPda2Get>',
          wantDbTo: 'ges-local',
        },
      });
      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrPda2Get (Получение сохраненого товара из накладной)
      C параметрами:
      City: ${City}
      IdNum: ${IdNum}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPrPda2Get: \n${soapRequest.xmlRequest}
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
            fail('Неподходящий формат баркода');
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
              console.log('\x1b[32m', JSON.stringify(responseXMLJS), '\x1b[0m');
              if (responseXMLJS.PocketPrPda2Get.$.Error === 'False') {
                success({
                  ArhKat: responseXMLJS.PocketPrPda2Get.ArhKat
                    ? responseXMLJS.PocketPrPda2Get.ArhKat
                    : [{Artic: ['-'], CodFirm: ['-']}],
                  ArtName: responseXMLJS.PocketPrPda2Get.ArtName
                    ? responseXMLJS.PocketPrPda2Get.ArtName[0]
                    : '-',
                  BarMeas: responseXMLJS.PocketPrPda2Get.BarMeas
                    ? responseXMLJS.PocketPrPda2Get.BarMeas[0]
                    : '-',
                  KatMeas: responseXMLJS.PocketPrPda2Get.KatMeas
                    ? responseXMLJS.PocketPrPda2Get.KatMeas[0]
                    : '-',
                  KatName: responseXMLJS.PocketPrPda2Get.KatName
                    ? responseXMLJS.PocketPrPda2Get.KatName[0]
                    : '-',
                  ListUpak: responseXMLJS.PocketPrPda2Get.ListUpak
                    ? responseXMLJS.PocketPrPda2Get.ListUpak[0]
                    : '-',
                  MonthLife: responseXMLJS.PocketPrPda2Get.MonthLife
                    ? responseXMLJS.PocketPrPda2Get.MonthLife[0]
                    : '-',
                  CodGood: responseXMLJS.PocketPrPda2Get.CodGood
                    ? responseXMLJS.PocketPrPda2Get.CodGood[0]
                    : '0',
                  MarkReqd: responseXMLJS.PocketPrPda2Get.MarkReqd
                    ? responseXMLJS.PocketPrPda2Get.MarkReqd[0]
                    : '',
                  DOP: responseXMLJS.PocketPrPda2Get.DOP
                    ? responseXMLJS.PocketPrPda2Get.DOP[0]
                    : '',
                  DateErr: responseXMLJS.PocketPrPda2Get.DateErr
                    ? responseXMLJS.PocketPrPda2Get.DateErr[0]
                    : '',
                  DateWarn: responseXMLJS.PocketPrPda2Get.DateWarn
                    ? responseXMLJS.PocketPrPda2Get.DateWarn[0]
                    : '',
                  QtyZak: responseXMLJS.PocketPrPda2Get.QtyZak
                    ? responseXMLJS.PocketPrPda2Get.QtyZak[0]
                    : '',
                  QtyThisPr: responseXMLJS.PocketPrPda2Get.QtyThisPr
                    ? responseXMLJS.PocketPrPda2Get.QtyThisPr[0]
                    : '',
                  QtyOtherPr: responseXMLJS.PocketPrPda2Get.QtyOtherPr
                    ? responseXMLJS.PocketPrPda2Get.QtyOtherPr[0]
                    : '',
                  QtyThidDBS: responseXMLJS.PocketPrPda2Get.QtyThidDBS
                    ? responseXMLJS.PocketPrPda2Get.QtyThidDBS[0]
                    : '',
                });
              }
              if (responseXMLJS.PocketPrPda2Get.$.Error === 'True') {
                fail(responseXMLJS.PocketPrPda2Get.Error[0]);
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
