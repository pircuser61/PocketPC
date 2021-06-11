import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import PerepalechivanieStore from '../mobx/PerepalechivanieStore';

const getShopName = (sas, namemaxidom) => {
  return sas.filter(r => r.palletNumber === namemaxidom)[0]?.$.CodShop;
};

export async function PocketPerepalSave(
  PerepalId = '',
  PalFrom = '',
  CodGood = '',
  BarCod = '',
  Create = '',
  ListPalTo = [],
  UID = '',
  City = '',
) {
  const model = {$: {CodGood: '', NumMax: '', NumPalTo: '', Qty: ''}};
  let ListPalToStr = '';
  ListPalTo.filter(r => r.$.Qty).map(
    r =>
      (ListPalToStr += `<ListPalToRow NumMax="${r.$.NumMax}" CodShop="${
        getShopName(PerepalechivanieStore.palletsList, r.$.NumPalTo)
          ? getShopName(PerepalechivanieStore.palletsList, r.$.NumPalTo)
          : ''
      }" NumPalTo="${r.$.NumPalTo}" Qty="${r.$.Qty}"/>`),
  );

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
          gate2prog: 'PocketPerepalSave,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPerepalSave>' +
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
            '<CodGood>' +
            CodGood +
            '</CodGood>' +
            '<BarCod>' +
            BarCod +
            '</BarCod>' +
            '<Create>' +
            Create +
            '</Create>' +
            '<ListPalTo>' +
            ListPalToStr +
            '</ListPalTo>' +
            '</PocketPerepalSave>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPerepalSave (Начало работы с накладной)
      C параметрами:
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPerepalSave: \n${
        '<?xml version="1.0" encoding="utf-8" ?>' +
        '<PocketPerepalSave>' +
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
        '<CodGood>' +
        CodGood +
        '</CodGood>' +
        '<BarCod>' +
        BarCod +
        '</BarCod>' +
        '<Create>' +
        Create +
        '</Create>' +
        '<ListPalTo>' +
        ListPalToStr +
        '</ListPalTo>' +
        '</PocketPerepalSave>'
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
              console.log(JSON.stringify(responseXMLJS));
              if (responseXMLJS.PocketPerepalSave.$.Error === 'False') {
                success(true);
              }
              if (responseXMLJS.PocketPerepalSave.$.Error === 'True') {
                fail(responseXMLJS.PocketPerepalSave.Error[0]);
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
