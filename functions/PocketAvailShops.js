import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketAvailShops(UID = '', City = '') {
  return new Promise((success, fail) => {
    try {
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate' + City + '/ws_gate',
      });

      const req =
        '<?xml version="1.0" encoding="utf-8" ?>' +
        '<PocketAvailShops>' +
        '<City>' +
        City +
        '</City>' +
        '<UID>' +
        UID +
        '</UID>' +
        '</PocketAvailShops>';

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketAvailShops,mobileGes',
          param4prog: req,
          wantDbTo: 'ges-local',
        },
      });
      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
            Начинается запрос в функции PocketAvailShops ( Получение списка доступных объединений )
            C параметрами:
            UID:${UID}
            По ссылке: ${soapRequest.requestURL}
            XML ЗАПРОС В ФУНКЦИИ VZAK: \n${req}
            `,

        '\x1b[0m',
      );

      soapRequest.timeout = 10000;

      soapRequest
        .sendRequest()
        .then(response => {
          !response ? fail('Ответ от сервера не пришел') : null;
          if (
            response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['SOAP-ENV:Fault']
          ) {
            fail('SOAP-ENV:Fault');
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
              if (responseXMLJS.PocketAvailShops.$.Error === 'False') {
                console.log(
                  '\x1b[32m',
                  'Функция PocketAvailShops отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );
                //console.log(responseXMLJS['PocketAvailShops']);

                if (!responseXMLJS['PocketAvailShops']['ObShop']) {
                  fail(
                    'Пришел пустой список подразделений. Возможно, проблема с доступом для пользователя.',
                  );
                }
                success(responseXMLJS['PocketAvailShops']['ObShop']);
              }
              if (responseXMLJS.PocketAvailShops.$.Error === 'True') {
                fail(responseXMLJS.PocketAvailShops.Error[0]);
              }
            });
          }
          fail('Ошибка сервиса!');
        })
        .catch(error => {
          fail('' + error);
        });
    } catch (error) {
      fail('' + error);
    }
  });
}
