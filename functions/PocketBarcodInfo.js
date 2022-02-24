import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function PocketBarcodInfo(barcode, City) {
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
          gate2prog: 'PocketBarcodInfo,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketBarcodInfo>' +
            '<City>' +
            City +
            '</City>' +
            '<Barcod>' +
            barcode +
            '</Barcod>' +
            '</PocketBarcodInfo>',
          wantDbTo: 'ges-local',
        },
      });

      soapRequest
        .sendRequest()
        .then(response => {
          !response ? fail('Ответ от сервера не пришел') : null;
          if (
            response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['SOAP-ENV:Fault']
          ) {
            fail('Неподходящий формат баркода');
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
              if (responseXMLJS['PocketBarcodInfo']['$']['Error'] === 'True') {
                fail(responseXMLJS['PocketBarcodInfo']['Error'][0]);
              }

              if (responseXMLJS['PocketBarcodInfo']['$']['Error'] === 'False') {
                success({
                  ...responseXMLJS['PocketBarcodInfo']['Result'][0],
                  barcode: barcode,
                });
              }
            });
          }
          fail('Произошла ошибка');
        })
        .catch(error => {
          fail('' + error);
        });
    } catch (error) {
      fail('' + error);
    }
  });
}
