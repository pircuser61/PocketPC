import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {
  createXMLByObject,
  ERROR_CONSOLE_LOG,
  SUCCES_CONSOLE_LOG,
} from '../constants/funcrions';

export async function PocketPalPlaceGet({
  NumPal = '',
  CodShop = '',
  SkipShop = 'false',
  UID = '',
  City = '',
}) {
  return new Promise((success, fail) => {
    try {
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate' + City + '/ws_gate',
      });

      const reqstr = createXMLByObject('PocketPalPlaceGet', {
        City,
        UID,
        NumPal,
        CodShop,
        SkipShop,
      });

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketPalPlaceGet,mobileGes',
          param4prog: reqstr,
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPalPlaceGet (Получение PerepalId для задания )
      C параметрами:
      NumPal  :${NumPal}
      CodShop  :${CodShop}
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPalPlaceGet: \n${reqstr}
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
              //console.log(JSON.stringify(responseXMLJS));

              if (responseXMLJS.PocketPalPlaceGet.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('PocketPalPlaceGet');
                success({
                  NumPal: responseXMLJS?.PocketPalPlaceGet?.NumPal[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.NumPal[0]
                    : '',
                  CodOb: responseXMLJS?.PocketPalPlaceGet?.CodOb[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.CodOb[0]
                    : '',
                  CodShop: responseXMLJS?.PocketPalPlaceGet?.CodShop[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.CodShop[0]
                    : '',
                  CodDep: responseXMLJS?.PocketPalPlaceGet?.CodDep[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.CodDep[0]
                    : '',
                  Comment: responseXMLJS?.PocketPalPlaceGet?.Comment[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.Comment[0]
                    : '',
                  CodFirm: responseXMLJS?.PocketPalPlaceGet?.CodFirm[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.CodFirm[0]
                    : '',
                  NameFirm: responseXMLJS?.PocketPalPlaceGet?.NameFirm[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.NameFirm[0]
                    : '',
                  Sector: responseXMLJS?.PocketPalPlaceGet?.Sector[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.Sector[0]
                    : '',
                  Rack: responseXMLJS?.PocketPalPlaceGet?.Rack[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.Rack[0]
                    : '',
                  Floor: responseXMLJS?.PocketPalPlaceGet?.Floor[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.Floor[0]
                    : '',
                  Place: responseXMLJS?.PocketPalPlaceGet?.Place[0]
                    ? responseXMLJS?.PocketPalPlaceGet?.Place[0]
                    : '',
                  ready: true,
                });
              }
              if (responseXMLJS.PocketPalPlaceGet.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'PocketPalPlaceGet',
                  responseXMLJS.PocketPalPlaceGet.Error[0],
                );
                fail(responseXMLJS.PocketPalPlaceGet.Error[0]);
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
