import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {ERROR_CONSOLE_LOG, SUCCES_CONSOLE_LOG} from '../constants/funcrions';

export async function PocketPerepal1(NumDoc = '', UID = '', City = '') {
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
          gate2prog: 'PocketPerepal1,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPerepal1>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<NumDoc>' +
            NumDoc +
            '</NumDoc>' +
            '</PocketPerepal1>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPerepal1 (Получение PerepalId для задания )
      C параметрами:
      NumDoc  :${NumDoc}
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPerepal1: \n${
        '<?xml version="1.0" encoding="utf-8" ?>' +
        '<PocketPerepal1>' +
        '<City>' +
        City +
        '</City>' +
        '<UID>' +
        UID +
        '</UID>' +
        '<NumDoc>' +
        NumDoc +
        '</NumDoc>' +
        '</PocketPerepal1>'
      }
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
              if (responseXMLJS.PocketPerepal1.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('PocketPerepal1');
                success(responseXMLJS.PocketPerepal1.PerepalId[0]);
              }
              if (responseXMLJS.PocketPerepal1.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'PocketPerepal1',
                  responseXMLJS.PocketPerepal1.Error[0],
                );
                fail(responseXMLJS.PocketPerepal1.Error[0]);
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
