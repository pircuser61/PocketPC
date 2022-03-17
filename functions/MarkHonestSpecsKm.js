import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {ERROR_CONSOLE_LOG, SUCCES_CONSOLE_LOG} from '../constants/funcrions';

export async function MarkHonestSpecsKm(
  SpecsId = '',
  SpecsType = 'vozp2',
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
        '<MarkHonestSpecsKm>' +
        '<City>' +
        City +
        '</City>' +
        '<UID>' +
        UID +
        '</UID>' +
        '<SpecsType>' +
        SpecsType +
        '</SpecsType>' +
        '<SpecsId>' +
        SpecsId +
        '</SpecsId>' +
        '<MarkType>2</MarkType>' +
        '</MarkHonestSpecsKm>';

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'MarkHonestSpecsKm,mobileGes',
          param4prog: reqstr,
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции MarkHonestSpecsKm (Получение PerepalId для задания )
      C параметрами:
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ MarkHonestSpecsKm: \n${reqstr}
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
              console.log(JSON.stringify(responseXMLJS));

              if (responseXMLJS.MarkHonestSpecsKM.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('MarkHonestSpecsKm');
                success(
                  responseXMLJS.MarkHonestSpecsKM.Mark[0]
                    ? responseXMLJS.MarkHonestSpecsKM.Mark[0].MarkRow
                    : [],
                );
              }
              if (responseXMLJS.MarkHonestSpecsKM.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'MarkHonestSpecsKm',
                  responseXMLJS.MarkHonestSpecsKM.Error[0],
                );
                fail(responseXMLJS.MarkHonestSpecsKM.Error[0]);
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
