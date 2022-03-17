import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrPda1(
  numNakl = '',
  CodOb = '',
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
          gate2prog: 'PocketPrPda1,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrPda1>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<CodOb>' +
            CodOb +
            '</CodOb>' +
            '<NumNakl>' +
            numNakl +
            '</NumNakl>' +
            '</PocketPrPda1>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrPda1 (Начало работы с накладной)
      C параметрами:
      numNakl: ${numNakl}
      CodOb  :${CodOb}
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPrPda1: \n${soapRequest.xmlRequest}
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
              if (responseXMLJS.PocketPrPda1.$.Error === 'False') {
                console.log(
                  '\x1b[32m',
                  'Функция PocketPrPda1 отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );
                let answer = false;
                if (
                  responseXMLJS.PocketPrPda1['New'][0].replace(/\s/g, '') ===
                  'true'
                ) {
                  answer = true;
                }
                console.log(responseXMLJS.PocketPrPda1);
                success({
                  answer,
                  ParentId: responseXMLJS.PocketPrPda1.IdNum[0],
                  IdNum: responseXMLJS.PocketPrPda1.IdNum[0],
                });
              }
              if (responseXMLJS.PocketPrPda1.$.Error === 'True') {
                fail(responseXMLJS.PocketPrPda1.Error[0]);
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
