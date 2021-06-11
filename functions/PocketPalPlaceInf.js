import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {ERROR_CONSOLE_LOG, SUCCES_CONSOLE_LOG} from '../constants/funcrions';

export async function PocketPalPlaceInf(
  Floor = '',
  Place = '',
  Rack = '',
  Sector = '',
  UID = '',
  City = '',
  CodShop = '',
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
        '<PocketPalPlaceInf>' +
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
        '<CodShop>' +
        CodShop +
        '</CodShop>' +
        '</PocketPalPlaceInf>';

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketPalPlaceInf,mobileGes',
          param4prog: reqstr,
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPalPlaceInf (Получение PerepalId для задания )
      C параметрами:
      
    
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPalPlaceInf: \n${reqstr}
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
              if (responseXMLJS.PocketPalPlaceInf.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('PocketPalPlaceInf');
                success(responseXMLJS.PocketPalPlaceInf.СurrPal[0]);
              }
              if (responseXMLJS.PocketPalPlaceInf.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'PocketPalPlaceInf',
                  responseXMLJS.PocketPalPlaceInf.Error[0],
                );
                fail(responseXMLJS.PocketPalPlaceInf.Error[0]);
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
