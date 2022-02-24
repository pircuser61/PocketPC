import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {Alert} from 'react-native';
import X2JS from 'x2js';

export async function CrossDockPalett(
  NumNakl = '',
  NumPal = '',
  BarCode = '',
  type = false,
  UID = '',
  City = '',
) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });
    const xmlRequest =
      '<CrossDockPalett>' +
      '<City>' +
      City +
      '</City>' +
      '<XdType>' +
      (type ? 'Out' : 'In') +
      '</XdType>' +
      '<NumNakl>' +
      NumNakl +
      '</NumNakl>' +
      '<NumPal>' +
      NumPal +
      '</NumPal>' +
      '<BarCode>' +
      BarCode +
      '</BarCode>' +
      '<UID>' +
      UID +
      '</UID>' +
      '</CrossDockPalett>';

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'CrossDockPalett,mobileGes',
        param4prog: xmlRequest,
        wantDbTo: 'ges-local',
      },
    });

    console.log(
      '\x1b[36m',
      `\n<----------------------------------------------------------------------->
            Начинается запрос в функции CrossDockPalett (Кросс-докинг (${
              type ? 'Расход' : 'Приход'
            }) )
            C параметрами:
            City: ${City}
            UID: ${UID}
            По ссылке: ${soapRequest.requestURL}
            XML ЗАПРОС В ФУНКЦИИ CrossDockPalett: \n${xmlRequest}
            `,

      '\x1b[0m',
    );

    let response = await soapRequest.sendRequest();
    if (!response) {
      throw 'Ответ от сервера не пришел!';
    } else {
      if (response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['SOAP-ENV:Fault']) {
        throw 'Ошибка ответа';
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

        var x2js = new X2JS();
        var document = x2js.xml2js(responseXML);
        if (document?.CrossDockPalett?._Error == 'True') {
          throw document?.CrossDockPalett?.Error;
        } else if (document?.CrossDockPalett?._Error == 'False') {
          return true;
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    console.log(error);
    throw error;
  }
}
