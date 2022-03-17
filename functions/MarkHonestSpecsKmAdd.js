import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {
  convertToXML,
  ERROR_CONSOLE_LOG,
  SUCCES_CONSOLE_LOG,
  x2js,
} from '../constants/funcrions';
import {toUTF8Array} from './checkTypes';
import X2JS from 'x2js';

export async function MarkHonestSpecsKmAdd(
  SpecsId = '',
  QR = '',
  SpecsType = 'vozp2',
  NaklNum = '',
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

      const reqstr =
        '<?xml version="1.0" encoding="utf-8" ?>' +
        '<MarkHonestSpecsKmAdd>' +
        '<City>' +
        City +
        '</City>' +
        '<UID>' +
        UID +
        '</UID>' +
        '<NaklType>' +
        SpecsType +
        '</NaklType>' +
        '<NaklNum>' +
        NaklNum +
        '</NaklNum>' +
        '<SpecsId>' +
        SpecsId +
        '</SpecsId>' +
        '<QR>' +
        convertToXML(QR)
          .split('')
          .map(r => {
            if (toUTF8Array(r) == 29) {
              return '&#x001d;';
            } else return r;
          })
          .join('') +
        '</QR>' +
        '</MarkHonestSpecsKmAdd>';

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'MarkHonestSpecsKmAdd,mobileGes',
          param4prog: reqstr,
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции MarkHonestSpecsKmAdd (Получение PerepalId для задания )
      C параметрами:
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ MarkHonestSpecsKmAdd: \n${reqstr}`,
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
              console.log(JSON.stringify(responseXMLJS));

              if (responseXMLJS?.MarkHonestSpecsKmAdd?.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('MarkHonestSpecsKmAdd');
                success(true);
              }
              if (responseXMLJS?.MarkHonestSpecsKmAdd?.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'MarkHonestSpecsKmAdd',
                  responseXMLJS.MarkHonestSpecsKmAdd.Error[0],
                );
                fail(responseXMLJS.MarkHonestSpecsKmAdd.Error[0]);
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
