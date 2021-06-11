import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import DeviceInfo from 'react-native-device-info';

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

      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'GetAccessToken4User,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<GetAccessToken4User ' +
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
            '' +
            '" ' +
            `deviceName="${hostName}" ` +
            'typeOS="' +
            'Android' +
            '" ' +
            'VersionSoft="' +
            DeviceInfo.getVersion() +
            '" ' +
            'moduleSoft="pocketpc" ' +
            'addPermit4Proc="maxstore.p" ' +
            '>' +
            '</GetAccessToken4User>',
          wantDbTo: 'ges-local',
        },
      });

      console.log(soapRequest.xmlRequest);
      soapRequest
        .sendRequest()
        .then(response => {
          if (!response || isNull(response)) {
            fail('Пришел пустой ответ');
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
