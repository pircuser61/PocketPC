import xmldom from 'xmldom';
import {uri} from '../connectInfo';
import {createXMLByObject, x2js} from '../constants/funcrions';
import SoapRequest from '../soap-client/soapclient';

export const SendEmail = async (
  email = '',
  subj = '',
  text = '',
  city = '',
) => {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + 1 + '/ws_gate',
    });
    let request_body = createXMLByObject('SendEmail', {
      City: city,
      Email: email,
      Subj: subj,
      Text: text,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'SendEmail,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    let response = await soapRequest.sendRequest();
    if (!response) {
      throw 'Пришел пустой ответ';
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

      let json = x2js.xml2js(responseXML);
      if (json?.SendEmail?._Error === 'True') {
        throw json.SendEmail.Error;
      } else if (json?.SendEmail?._Error === 'False') {
        return true;
      }
    }
    throw 'Неизвестная ошибка';
  } catch (error) {
    console.log(error);
  }
};
