import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import DeviceInfo from 'react-native-device-info';
import {createXMLByObject} from '../constants/funcrions';

export async function gesAuth(
  login = '',
  password = '',
  city = '',
  hostName = '',
) {
  return new Promise((success, fail) => {
    try {
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate' + city + '/ws_gate',
      });

      const req = createXMLByObject(
        'GetAccessToken4User ' +
          'UserUID="' +
          login +
          '" ' +
          'CityUser="' +
          city +
          '" ' +
          'UserHash="' +
          password +
          '" ' +
          'deviceID="' +
          DeviceInfo.getDeviceId() +
          '" ' +
          `deviceName="${hostName}" ` +
          'typeOS="' +
          'Android' +
          '" ' +
          'VersionSoft="' +
          DeviceInfo.getVersion() +
          '" ' +
          'moduleSoft="pocketpc" ',
      );

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'GetAccessToken4User,mobileGes',
          param4prog: req,
          wantDbTo: 'ges-local',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
            Начинается запрос в функции gesAuth ( Вход в систему )
            По адресу:${soapRequest.requestURL}
            C параметрами:
            ${req}
            `,

        '\x1b[0m',
      );

      soapRequest.timeout = 10000;
      soapRequest
        .sendRequest()
        .then(response => {
          if (!response) {
            fail('Ответ от сервера не пришел');
          }

          // console.log(response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0])
          let responseXML =
            response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
              'ns1:ws_gateResponse'
            ][0]['xmlOut'][0]['_'];
          let user;
          parseString(responseXML, (err, responseXMLJS) => {
            //console.log('!!!'+JSON.stringify(responseXMLJS));
            if (err) {
              fail(err);
            }

            if (responseXMLJS['ReturnResponse']['$']['Error'] !== 'False') {
              let addComment = undefined;
              try {
                addComment =
                  responseXMLJS['ReturnResponse']['ReturnMessage'][0];
              } catch {
                1;
              }
              fail(addComment);
            }

            user = responseXMLJS['ReturnResponse'];

            success(Object.assign({}, {user}));
          });
        })
        .catch(e => {
          //alert(e)
          fail(e);
        });
    } catch (error) {
      fail('' + error);
    }
  });
}

/**          requestURL: 'http://109.124.66.52:8880/ws_gate1/ws_gate'
 */
