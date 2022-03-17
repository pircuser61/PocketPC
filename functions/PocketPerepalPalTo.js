import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import PerepalechivanieStore from '../mobx/PerepalechivanieStore';
import {ERROR_CONSOLE_LOG, SUCCES_CONSOLE_LOG} from '../constants/funcrions';

const getShopName = (sas, namemaxidom) => {
  //console.log(sas);
  //console.log(item);
  return sas.filter(r => r.palletNumber === namemaxidom)[0]?.$.CodShop;
};

export async function PocketPerepalPalTo(
  PerepalId = '',
  PalFrom = '',
  CodGood = '',
  SkipCheck = '',
  ListPalTo = [],
  UID = '',
  City = '',
) {
  let newArrowString = '';
  let needCodGood = CodGood ? '<CodGood>' + CodGood + '</CodGood>' : '';

  ListPalTo.filter(r => r.palletNumber).map(r => {
    newArrowString =
      newArrowString +
      `<ListPalToRow NumMax="${r.$.NumMax}" NumPalTo="${r.palletNumber}" ${
        CodGood
          ? getShopName(PerepalechivanieStore.palletsList, r.palletNumber)
            ? 'CodShop="' +
              getShopName(PerepalechivanieStore.palletsList, r.palletNumber) +
              '" '
            : ''
          : ''
      }/>`;
  });

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
          gate2prog: 'PocketPerepalPalTo,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPerepalPalTo>' +
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
            needCodGood +
            '<ListPalTo>' +
            newArrowString +
            '</ListPalTo>' +
            '</PocketPerepalPalTo>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPerepalPalTo (Получение списка паллет ${
        CodGood ? ': Для товара' : ''
      })
      C параметрами:
      PerepalId: ${PerepalId}
      PalFrom: ${PalFrom}
      Строка паллетов: ${newArrowString ? newArrowString : 'Пусто'}
      UID: ${UID}
      City: ${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPerepalPalTo: \n${
        '<?xml version="1.0" encoding="utf-8" ?>' +
        '<PocketPerepalPalTo>' +
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
        needCodGood +
        '<ListPalTo>' +
        newArrowString +
        '</ListPalTo>' +
        '</PocketPerepalPalTo>'
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
              if (
                responseXMLJS?.PocketPerepalPalToResponse?.$?.Error === 'True'
              ) {
                fail('Ошибка брокера PocketPerepalPalTo');
              }

              // {"PocketPerepalPalToResponse": {"$": {"DateResponse": "31.05.2021", "Error": "True", "ErrorCode": "1"}}}
              if (responseXMLJS?.PocketPerepalPalTo.$.Error === 'False') {
                SUCCES_CONSOLE_LOG('PocketPerepalPalTo');

                success(
                  responseXMLJS?.PocketPerepalPalTo?.ListGoods[0]
                    ? responseXMLJS.PocketPerepalPalTo?.ListGoods[0]
                        .ListGoodsRow
                    : [],
                );
              }
              if (responseXMLJS?.PocketPerepalPalTo?.$.Error === 'True') {
                ERROR_CONSOLE_LOG(
                  'PocketPerepalPalTo',
                  responseXMLJS?.PocketPerepalPalTo?.Error[0],
                );
                fail(responseXMLJS?.PocketPerepalPalTo?.Error[0]);
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
