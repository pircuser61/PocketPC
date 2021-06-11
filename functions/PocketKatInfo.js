import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketKatInfo(
  CodGood = '',
  ParentId = '',
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
          gate2prog: 'PocketKatInfo,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketKatInfo>' +
            '<City>' +
            City +
            '</City>' +
            '<CodGood>' +
            CodGood +
            '</CodGood>' +
            '<ParentId>' +
            ParentId +
            '</ParentId>' +
            '<UID>' +
            UID +
            '</UID>' +
            '</PocketKatInfo>',
          wantDbTo: 'ges-local',
        },
      });
      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketKatInfo (Информация о баркоде в приемке)
      C параметрами:
      CodGood: ${CodGood}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketKatInfo: \n${soapRequest.xmlRequest}
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
              if (responseXMLJS.PocketKatInfo.$.Error === 'False') {
                success({
                  DateErr: responseXMLJS.PocketKatInfo.DateErr[0]
                    ? responseXMLJS.PocketKatInfo.DateErr[0]
                    : '',
                  DateWarn: responseXMLJS.PocketKatInfo.DateWarn[0]
                    ? responseXMLJS.PocketKatInfo.DateWarn[0]
                    : '',
                  ListUpak: responseXMLJS.PocketKatInfo.ListUpak[0]
                    ? responseXMLJS.PocketKatInfo.ListUpak[0]
                    : '',
                  MonthLife: responseXMLJS.PocketKatInfo.MonthLife[0]
                    ? responseXMLJS.PocketKatInfo.MonthLife[0]
                    : '',
                  MarkReqd: responseXMLJS.PocketKatInfo.MarkReqd[0]
                    ? responseXMLJS.PocketKatInfo.MarkReqd[0]
                    : '',
                });
              }
              if (responseXMLJS.PocketKatInfo.$.Error === 'True') {
                fail(responseXMLJS.PocketKatInfo.Error[0]);
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
