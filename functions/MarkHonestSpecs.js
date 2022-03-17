import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {ERROR_CONSOLE_LOG, SUCCES_CONSOLE_LOG} from '../constants/funcrions';

export async function MarkHonestSpecs(
  NaklNum = '',
  Filter = '',
  NaklType = 'vozp',
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
          gate2prog: 'MarkHonestSpecs,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<MarkHonestSpecs>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<NaklNum>' +
            NaklNum +
            '</NaklNum>' +
            '<NaklType>' +
            NaklType +
            '</NaklType>' +
            '<Filter>' +
            Filter +
            '</Filter>' +
            '</MarkHonestSpecs>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции MarkHonestSpecs (Получение PerepalId для задания )
      C параметрами:
      NaklNum  :${NaklNum}
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ MarkHonestSpecs: \n${
        '<MarkHonestSpecs>' +
        '<City>' +
        City +
        '</City>' +
        '<UID>' +
        UID +
        '</UID>' +
        '<NaklNum>' +
        NaklNum +
        '</NaklNum>' +
        '<NaklType>' +
        'vozp' +
        '</NaklType>' +
        '<Filter>' +
        Filter +
        '</Filter>' +
        '</MarkHonestSpecs>'
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
              // console.log(JSON.stringify(responseXMLJS));

              if (responseXMLJS.MarkHonestSpecs.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('MarkHonestSpecs');
                success(responseXMLJS.MarkHonestSpecs);
              }
              if (responseXMLJS.MarkHonestSpecs.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'MarkHonestSpecs',
                  responseXMLJS.MarkHonestSpecs.Error[0],
                );
                fail(responseXMLJS.MarkHonestSpecs.Error[0]);
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
