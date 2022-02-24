import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketListPrinters(PcName, City) {
  return new Promise((success, fail) => {
    try {
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate' + City + '/ws_gate',
      });

      const request_body =
        '<PocketListPrinters>' +
        '<City>' +
        City +
        '</City>' +
        '<PcName>' +
        PcName +
        '</PcName>' +
        '<PrinterTypes>1,2,3,4</PrinterTypes>' +
        '</PocketListPrinters>';

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketListPrinters,mobileGes',
          param4prog: request_body,
          wantDbTo: 'ges-local',
        },
      });
      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции PocketListPrinters ( Получение списка принтеров )
      C параметрами:
      City: ${City}
      PcName: ${PcName}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ PocketListPrinters: \n${request_body}
      `,
        '\x1b[0m',
      );
      soapRequest
        .sendRequest()
        .then(response => {
          response ? null : fail('Ответ от сервера не пришел');
          let responseXML =
            response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
              'ns1:ws_gateResponse'
            ][0]['xmlOut'][0]['_'];
          //console.log('XML'+responseXML);
          parseString(responseXML, (err, responseXMLJS) => {
            if (responseXMLJS['PocketListPrinters']['$']['Error'] === 'True') {
              fail(responseXMLJS['PocketListPrinters']['Error'][0]);
            }
            if (responseXMLJS['PocketListPrinters']['$']['Error'] === 'False') {
              success(
                responseXMLJS['PocketListPrinters']['Printer'][0]['PrinterRow'],
              );
            }
            fail('Неизвестная ошибка');
          });
        })
        .catch(error => {
          fail('' + error);
        });
    } catch (error) {
      fail('' + error);
    }
  });
}
