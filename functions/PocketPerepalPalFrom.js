import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {ERROR_CONSOLE_LOG, SUCCES_CONSOLE_LOG} from '../constants/funcrions';

export async function PocketPerepalPalFrom(
  PerepalId = '',
  PalFrom = '',
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
          gate2prog: 'PocketPerepalPalFrom,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPerepalPalFrom>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<PerepalId>' +
            PerepalId +
            '</PerepalId>' +
            '<PalFrom>' +
            PalFrom +
            '</PalFrom>' +
            '</PocketPerepalPalFrom>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPerepalPalFrom (Проверяет палетт и возвращает список максидомов куда требуются товары из данного палетта.)
      C параметрами:
      PerepalId  :${PerepalId}
      PalFrom  :${PalFrom}
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPerepalPalFrom: \n${soapRequest.xmlRequest}
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
              if (responseXMLJS.PocketPerepalPalFrom.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('PocketPerepalPalFrom');

                success(
                  responseXMLJS.PocketPerepalPalFrom.ListMax[0].ListMaxRow,
                );
              }
              if (responseXMLJS.PocketPerepalPalFrom.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'PocketPerepalPalFrom',
                  responseXMLJS.PocketPerepalPalFrom.Error[0],
                );
                fail(responseXMLJS.PocketPerepalPalFrom.Error[0]);
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
