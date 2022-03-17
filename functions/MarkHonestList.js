import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function MarkHonestList(
  numNakl = '',
  numPal = '',
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
          gate2prog: 'MarkHonestList,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<MarkHonestList>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<DocType>pr_pda2</DocType>' +
            '<NumNakl>' +
            numNakl +
            '</NumNakl>' +
            '<NumPal>' +
            numPal +
            '</NumPal>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' +
            '</MarkHonestList>',
          wantDbTo: 'ges-local',
        },
      });
      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции MarkHonestList (Начало работы с накладной)
      C параметрами:
      City: ${City}
      UID: ${UID}
      numNakl: ${numNakl}
      IdNum: ${IdNum}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ MarkHonestList: \n${soapRequest.xmlRequest}
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
              if (responseXMLJS.MarkHonestList.$.Error === 'False')
                console.log(
                  '\x1b[32m',
                  'Функция MarkHonestList отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );
              success(responseXMLJS.MarkHonestList.Goods);
              if (responseXMLJS.MarkHonestList.$.Error === 'True') {
                console.log(
                  '\x1b[31m',
                  `\nПроизошла ошибка в функции AddMarkList\n${responseXMLJS.MarkHonestList.Error[0]}\n<----------------------------------------------------------------------->`,
                  '\x1b[0m',
                );

                fail(responseXMLJS.MarkHonestList.Error[0]);
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
