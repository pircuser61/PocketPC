import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketMenu(City = '', Shop = '', UID = '') {
  return new Promise((success, fail) => {
    try {
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate'+City+'/ws_gate',
      });

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketMenu,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketMenu>' +
            '<City>'+City+'</City>' +
            '<Shop>'+Shop+'</Shop>' +
            '<UID>'+UID+'</UID>' +
            '<Procedure>ms_pocket.p</Procedure>' +
            '</PocketMenu>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketMenu (Получение меню PocketPC)
      C параметрами:
      City: ${City}
      Shop: ${Shop}
      UID: ${UID}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketMenu: \n${soapRequest.xmlRequest}`,'\x1b[0m',);

      soapRequest
        .sendRequest()
        .then((response) => {
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
              if (responseXMLJS.PocketMenu.$.Error === 'False') {
                if (
                  typeof responseXMLJS['PocketMenu']['MI'][0]['MI'] === 'object'
                ) {
                  console.log('\x1b[32m','Функция PocketMenu отработала нормально\n<----------------------------------------------------------------------->' ,'\x1b[0m');

                  success(responseXMLJS['PocketMenu']['MI'][0]['MI'][0]['MI']);
                  
                }
                else {
                  console.log('\x1b[32m','Функция PocketMenu отработала нормально\n<----------------------------------------------------------------------->' ,'\x1b[0m');
                  success([])
                }
              }
              if (responseXMLJS.PocketMenu.$.Error === 'True') {
                fail(responseXMLJS.PocketMenu.Error[0])
              }
            });
          }
          fail('Произошла ошибка');
        })
        .catch((error) => {
          fail('' + error);
        });
    } catch (error) {
      fail('' + error);
    }
  });
}
