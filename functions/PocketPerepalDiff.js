import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {ERROR_CONSOLE_LOG, SUCCES_CONSOLE_LOG} from '../constants/funcrions';
import PerepalechivanieStore from '../mobx/PerepalechivanieStore';

export async function PocketPerepalDiff(
  PerepalId = '',
  AllPallets = 'false',
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
          gate2prog: 'PocketPerepalDiff,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPerepalDiff>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<PerepalId>' +
            PerepalId +
            '</PerepalId>' +
            '<AllPallets>' +
            AllPallets +
            '</AllPallets>' +
            '</PocketPerepalDiff>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPerepalDiff (Получение информации о товаре по его коду ( Перепалечивание ))
      C параметрами:
      PerepalId  :${PerepalId}
      AllPallets  :${AllPallets}
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPerepalDiff: \n${
        '<?xml version="1.0" encoding="utf-8" ?>' +
        '<PocketPerepalDiff>' +
        '<City>' +
        City +
        '</City>' +
        '<UID>' +
        UID +
        '</UID>' +
        '<PerepalId>' +
        PerepalId +
        '</PerepalId>' +
        '<AllPallets>' +
        AllPallets +
        '</AllPallets>' +
        '</PocketPerepalDiff>'
      }
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
              console.log(responseXMLJS);
              if (
                responseXMLJS.PocketPerepalDiffResponse?.$?.Error === 'True'
              ) {
                fail('Ошибка брокера PocketPerepalDiff');
              }
              if (responseXMLJS.PocketPerepalDiff.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('PocketPerepalDiff');
                if (!responseXMLJS.PocketPerepalDiff.Diff[0]) {
                  success([]);
                } else success(responseXMLJS.PocketPerepalDiff.Diff[0].DiffRow);
              }
              if (responseXMLJS.PocketPerepalDiff.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'PocketPerepalDiff',
                  responseXMLJS.PocketPerepalDiff.Error[0],
                );
                fail(responseXMLJS.PocketPerepalDiff.Error[0]);
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
