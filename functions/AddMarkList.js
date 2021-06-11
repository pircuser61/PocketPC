import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

const LISTQR = ["010805193111113821z<NL!:t>'/(d&"];

export async function AddMarkList(
  ParentId = '',
  IdNum = '',
  DocType = '',
  ListQR = [],
  UID = '',
  City = '',
) {
  return new Promise((success, fail) => {
    try {
      let ListArr = '';
      ListQR.map(r => {
        let str =
          '<QR>' + r.replace(/&/g, '&amp;').replace(/</g, '&lt;') + '</QR>';
        ListArr = ListArr + str;
      });

      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate' + City + '/ws_gate',
      });

      //"010805193111113821z<NL!:t>'/(d&"

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'MarkHonestAddList,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<MarkHonestAddList>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<DocType>' +
            DocType +
            '</DocType>' +
            '<ParentId>' +
            ParentId +
            '</ParentId>' +
            '<IdNum>' +
            IdNum +
            '</IdNum>' +
            '<ListQR>' +
            ListArr +
            '</ListQR>' +
            '</MarkHonestAddList>',
          wantDbTo: 'ges-local',
        },
      });
      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
            Начинается запрос в функции AddMarkList ( Добавление кода маркировки в накладную )
            C параметрами:
            City: ${City}
            UID: ${UID}
            ParentId: ${ParentId}
            IdNum: ${IdNum}
            
            По ссылке: ${soapRequest.requestURL}
            XML ЗАПРОС В ФУНКЦИИ AddMarkList: \n${soapRequest.xmlRequest}
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
              console.log(
                '\x1b[32m',
                JSON.stringify(responseXMLJS) +
                  '\n<----------------------------------------------------------------------->',
                '\x1b[0m',
              );

              if (responseXMLJS.MarkHonestAddList.$.Error === 'False') {
                success(responseXMLJS.MarkHonestAddList.Msg[0]);
              }
              if (responseXMLJS.MarkHonestAddList.$.Error === 'True') {
                console.log(
                  '\x1b[31m',
                  `\nПроизошла ошибка в функции AddMarkList\n${responseXMLJS.MarkHonestAddList.Error[0]}\n<----------------------------------------------------------------------->`,
                  '\x1b[0m',
                );

                fail(responseXMLJS.MarkHonestAddList.Error[0]);
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
