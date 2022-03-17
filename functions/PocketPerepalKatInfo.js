import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {ERROR_CONSOLE_LOG, SUCCES_CONSOLE_LOG} from '../constants/funcrions';
import PerepalechivanieStore from '../mobx/PerepalechivanieStore';

export async function PocketPerepalKatInfo(
  PerepalId = '',
  PalFrom = '',
  CodGood = '',
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
          gate2prog: 'PocketPerepalKatInfo,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPerepalKatInfo>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<PerepalId>' +
            PerepalId +
            '</PerepalId>' +
            '<PalFrom>' +
            PalFrom +
            '</PalFrom>' +
            '<ListShopTo>' +
            PerepalechivanieStore.palletsList
              .filter(r => r.palletNumber)
              .map(item => item.$.CodShop)
              .toString() +
            '</ListShopTo>' +
            '<CodGood>' +
            CodGood +
            '</CodGood>' +
            '</PocketPerepalKatInfo>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPerepalKatInfo (Получение информации о товаре по его коду ( Перепалечивание ))
      C параметрами:
      PerepalId  :${PerepalId}
      PalFrom  :${PalFrom}
      CodGood  :${CodGood}
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPerepalKatInfo: \n${soapRequest.xmlRequest}
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
              //console.log(responseXMLJS);
              if (
                responseXMLJS.PocketPerepalKatInfoResponse?.$?.Error === 'True'
              ) {
                fail('Ошибка брокера PocketPerepalKatInfo');
              }
              if (responseXMLJS.PocketPerepalKatInfo.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('PocketPerepalKatInfo');
                success({
                  CodGood: responseXMLJS.PocketPerepalKatInfo.CodGood[0]
                    ? responseXMLJS.PocketPerepalKatInfo.CodGood[0]
                    : '',
                  KatName: responseXMLJS.PocketPerepalKatInfo.KatName[0]
                    ? responseXMLJS.PocketPerepalKatInfo.KatName[0]
                    : '',
                  ArtName: responseXMLJS.PocketPerepalKatInfo.ArtName[0]
                    ? responseXMLJS.PocketPerepalKatInfo.ArtName[0]
                    : '',
                  QtyPal: responseXMLJS.PocketPerepalKatInfo.QtyPal[0]
                    ? responseXMLJS.PocketPerepalKatInfo.QtyPal[0]
                    : '',
                  QtyReqd: responseXMLJS.PocketPerepalKatInfo.QtyReqd[0]
                    ? responseXMLJS.PocketPerepalKatInfo.QtyReqd[0]
                    : '',
                  QtyOtherZnp: responseXMLJS.PocketPerepalKatInfo.QtyOtherZnp[0]
                    ? responseXMLJS.PocketPerepalKatInfo.QtyOtherZnp[0]
                    : '',
                  QtyThisDbsood: responseXMLJS.PocketPerepalKatInfo
                    .QtyThisDbs[0]
                    ? responseXMLJS.PocketPerepalKatInfo.QtyThisDbs[0]
                    : '',
                });
              }
              if (responseXMLJS.PocketPerepalKatInfo.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'PocketPerepalKatInfo',
                  responseXMLJS.PocketPerepalKatInfo.Error[0],
                );
                fail(responseXMLJS.PocketPerepalKatInfo.Error[0]);
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
