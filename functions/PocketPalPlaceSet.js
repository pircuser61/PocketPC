import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {ERROR_CONSOLE_LOG, SUCCES_CONSOLE_LOG} from '../constants/funcrions';

export async function PocketPalPlaceSet(
  Floor = '',
  Place = '',
  Rack = '',
  Sector = '',
  NumPal = '',
  CodShop = '',
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
        '<PocketPalPlaceSet>' +
        '<City>' +
        City +
        '</City>' +
        '<UID>' +
        UID +
        '</UID>' +
        '<Sector>' +
        Sector +
        '</Sector>' +
        '<Rack>' +
        Rack +
        '</Rack>' +
        '<Floor>' +
        Floor +
        '</Floor>' +
        '<Place>' +
        Place +
        '</Place>' +
        '<NumPal>' +
        NumPal +
        '</NumPal>' +
        '<CodShop>' +
        CodShop +
        '</CodShop>' +
        '</PocketPalPlaceSet>';

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketPalPlaceSet,mobileGes',
          param4prog: reqstr,
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPalPlaceSet (Получение PerepalId для задания )
      C параметрами:
      
    
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPalPlaceSet: \n${reqstr}
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
              if (responseXMLJS.PocketPalPlaceSet.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('PocketPalPlaceSet');
                success(true);
              }
              if (responseXMLJS.PocketPalPlaceSet.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'PocketPalPlaceSet',
                  responseXMLJS.PocketPalPlaceSet.Error[0],
                );
                fail(responseXMLJS.PocketPalPlaceSet.Error[0]);
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
