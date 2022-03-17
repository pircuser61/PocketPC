import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketPrPda1s(numNakl = '', UID = '', City = '') {
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
          gate2prog: 'PocketPrPda1s,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrPda1s>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<NumNakl>' +
            numNakl +
            '</NumNakl>' +
            '</PocketPrPda1s>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketPrPda1s (Начало работы с накладной штрих-бумага)
      C параметрами:
      numNakl: ${numNakl}
      UID  :${UID}
      City  :${City}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketPrPda1s: \n${soapRequest.xmlRequest}
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
              if (responseXMLJS.PocketPrPda1s.$.Error === 'False') {
                console.log(
                  '\x1b[32m',
                  'Функция PocketPrPda1s отработала нормально\n<----------------------------------------------------------------------->',
                  '\x1b[0m',
                );
                // console.log(responseXMLJS.PocketPrPda1s);
                let answer = false;
                //IdNUm dobavit
                if (
                  responseXMLJS.PocketPrPda1s['New'][0].replace(/\s/g, '') ===
                  'true'
                ) {
                  answer = true;
                }
                console.log(responseXMLJS.PocketPrPda1s);
                success({
                  answer,
                  IdNum: responseXMLJS.PocketPrPda1s.IdNum[0],
                  ListOb: responseXMLJS.PocketPrPda1s.ListOb[0]
                    ? responseXMLJS.PocketPrPda1s.ListOb
                    : [{Ob: ['']}],
                });
              }
              if (responseXMLJS.PocketPrPda1s.$.Error === 'True') {
                fail(responseXMLJS.PocketPrPda1s.Error[0]);
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
