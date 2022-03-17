import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrPda1sOb(
  IdNum = '',
  ListOb = [{cod_ob: '', checked: false}],
  UID = '',
  City = '',
) {
  let ListObNew = '';
  ListOb.map(r => {
    if (r.checked) ListObNew = ListObNew + '<Ob>' + r.cod_ob + '</Ob>';
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
          gate2prog: 'PocketPrPda1sOb,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrPda1sOb>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' +
            '<ListOb>' +
            ListObNew +
            '</ListOb>' +
            '</PocketPrPda1sOb>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrPda1sOb (Указание списка выбранных городов для накладной)
      C параметрами:
      IdNum: ${IdNum}
      ListObNew  :${ListObNew}
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPrPda1sOb: \n${soapRequest.xmlRequest}
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
              // console.log(JSON.stringify(responseXMLJS["PocketPrPda2"]['rows']))
              //console.log(responseXMLJS);
              if (responseXMLJS.PocketPrPda1sOb.$.Error === 'False') {
                console.log(
                  '\x1b[32m',
                  'Функция PocketPrPda1sOb отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );
                success(true);
              }
              if (responseXMLJS.PocketPrPda1sOb.$.Error === 'True') {
                fail(responseXMLJS.PocketPrPda1sOb.Error[0]);
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
