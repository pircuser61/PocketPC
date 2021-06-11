import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

function isEmpty(e) {
  if (typeof e == 'undefined') return true;
  switch (e) {
    case '':
    case 0:
    case '0':
    case null:
    case false:
      return true;
    default:
      return false;
  }
}

function isNull(e) {
  if (typeof e == 'undefined') return true;
  switch (e) {
    case null:
      return true;
    default:
      return false;
  }
}

export async function getCity(device, url) {
  return new Promise((success, fail) => {
    try {
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate1/ws_gate',
      });

      console.log(
        'log' + 'Start ws request for getCity to ' + soapRequest.requestURL,
      );
      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'GetAvailCityShops,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<GetCity ' +
            'deviceID="' +
            'GetCitiesList' +
            '" ' +
            'deviceName="' +
            'GetCitiesList' +
            '" ' +
            'typeOS="' +
            'Android' +
            '" ' +
            'versionSoft="' +
            '1.0' +
            '" ' +
            'moduleSoft="pocketpc" ' +
            '>' +
            '</GetAccessToken4User>',
          wantDbTo: 'ges-local',
        },
      });
      soapRequest
        .sendRequest()
        .then(response => {
          if (!response || isNull(response)) {
            fail('Ответ сервера не пришел.\nПроверьте подключение к сети!');
          }
          let responseXML =
            response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
              'ns1:ws_gateResponse'
            ][0]['xmlOut'][0]['_'];
          let cityListJS;
          parseString(responseXML, (err, responseXMLJS) => {
            if (err) {
              throw err;
            }

            if (responseXMLJS['ReturnResponse']['$']['Error'] !== 'False') {
              let addComment = undefined;
              try {
                addComment =
                  responseXMLJS['ReturnResponse']['ReturnMessage'][0];
              } catch {
                1;
              }
              throw new Error(
                'Ошибка ' + (isNull(addComment) ? '' : ':\n' + addComment),
              );
            }
            cityListJS = responseXMLJS['ReturnResponse']['CityList'][0]['City'];
            cityListJS = cityListJS.map(r => r['$']);
            //console.log ('ГОРОДА'+cityListJS);
            success(Object.assign({}, {cityList: cityListJS}));
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
