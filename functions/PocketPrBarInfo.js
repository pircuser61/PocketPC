import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrBarInfo(barcode = '', City = '', NumNakl = '') {
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
          gate2prog: 'PocketPrBarInfo,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrBarInfo>' +
            '<City>' +
            City +
            '</City>' +
            '<Barcod>' +
            barcode +
            '</Barcod>' +
            '<NumNakl>' +
            NumNakl +
            '</NumNakl>' +
            '</PocketPrBarInfo>',
          wantDbTo: 'ges-local',
        },
      });
      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrBarInfo (Информация о баркоде в приемке)
      C параметрами:
      barcode: ${barcode}
      NumNakl: ${NumNakl}
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
              console.log(responseXMLJS);
              if (responseXMLJS.PocketPrBarInfo.$.Error === 'False') {
                success({
                  ArhKat: responseXMLJS.PocketPrBarInfo.ArhKat
                    ? responseXMLJS.PocketPrBarInfo.ArhKat
                    : [{Artic: ['-'], CodFirm: ['-']}],
                  ArtName: responseXMLJS.PocketPrBarInfo.ArtName
                    ? responseXMLJS.PocketPrBarInfo.ArtName[0]
                    : '-',
                  BarMeas: responseXMLJS.PocketPrBarInfo.BarMeas
                    ? responseXMLJS.PocketPrBarInfo.BarMeas[0]
                    : '-',
                  KatMeas: responseXMLJS.PocketPrBarInfo.KatMeas
                    ? responseXMLJS.PocketPrBarInfo.KatMeas[0]
                    : '-',
                  KatName: responseXMLJS.PocketPrBarInfo.KatName
                    ? responseXMLJS.PocketPrBarInfo.KatName[0]
                    : '-',
                  ListUpak: responseXMLJS.PocketPrBarInfo.ListUpak
                    ? responseXMLJS.PocketPrBarInfo.ListUpak[0]
                    : '-',
                  MonthLife: responseXMLJS.PocketPrBarInfo.MonthLife
                    ? responseXMLJS.PocketPrBarInfo.MonthLife[0]
                    : '-',
                  CodGood: responseXMLJS.PocketPrBarInfo.CodGood
                    ? responseXMLJS.PocketPrBarInfo.CodGood[0]
                    : '',
                  MarkReqd: responseXMLJS.PocketPrBarInfo.MarkReqd
                    ? responseXMLJS.PocketPrBarInfo.MarkReqd[0]
                    : '',
                  DOP: responseXMLJS.PocketPrBarInfo.DOP
                    ? responseXMLJS.PocketPrBarInfo.DOP[0]
                    : '',
                  DateErr: responseXMLJS.PocketPrBarInfo.DateErr
                    ? responseXMLJS.PocketPrBarInfo.DateErr[0]
                    : '',
                  DateWarn: responseXMLJS.PocketPrBarInfo.DateWarn
                    ? responseXMLJS.PocketPrBarInfo.DateWarn[0]
                    : '',
                  QtyZak: responseXMLJS.PocketPrBarInfo.QtyZak
                    ? responseXMLJS.PocketPrBarInfo.QtyZak[0]
                    : '',
                  QtyThisPr: responseXMLJS.PocketPrBarInfo.QtyThisPr
                    ? responseXMLJS.PocketPrBarInfo.QtyThisPr[0]
                    : '',
                  QtyOtherPr: responseXMLJS.PocketPrBarInfo.QtyOtherPr
                    ? responseXMLJS.PocketPrBarInfo.QtyOtherPr[0]
                    : '',
                  QtyThidDBS: responseXMLJS.PocketPrBarInfo.QtyThidDBS
                    ? responseXMLJS.PocketPrBarInfo.QtyThidDBS[0]
                    : '',
                  ListNN: responseXMLJS.PocketPrBarInfo.ListNN
                    ? responseXMLJS.PocketPrBarInfo.ListNN[0]
                    : '',
                });
              }
              if (responseXMLJS.PocketPrBarInfo.$.Error === 'True') {
                fail(responseXMLJS.PocketPrBarInfo.Error[0]);
              }
              //success()
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
