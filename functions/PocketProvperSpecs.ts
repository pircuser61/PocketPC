import SoapRequest from '../soap-client/soapclient';
// @ts-ignore
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {
  createXMLByObject,
  ERROR_CONSOLE_LOG,
  START_REQUEST_LOG,
  SUCCES_CONSOLE_LOG,
  x2js,
} from '../constants/funcrions';
import {PocketProvperSpecsProps} from '../types/types';

export async function PocketProvperSpecs({
  City = '',
  UID = '',
  CodShop = '',
  NumProv = '',
  Cmd,
  NumNakl = '',
  FilterDiff = 'false',
}: {
  City?: string;
  UID?: string;
  CodShop: string;
  NumProv: string;
  Cmd: 'first' | 'last' | 'prev' | 'next' | 'create' | 'curr';
  NumNakl: string;
  FilterDiff: 'true' | 'false';
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketProvperSpecs', {
      City,
      UID,
      CodShop,
      NumProv,
      Cmd,
      FilterDiff,
      NumNakl,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvperSpecs,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvperSpecs',
      describe: 'Получить накладную',
      url: soapRequest.requestURL,
    });

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

        //console.log(responseXML);

        const document: {
          PocketProvperSpecs: PocketProvperSpecsProps;
        } = x2js.xml2js(responseXML);
        console.log(JSON.stringify(document));

        if (document?.PocketProvperSpecs?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvperSpecs',
            document?.PocketProvperSpecs?.Error,
          );
          throw document?.PocketProvperSpecs?.Error;
        } else if (document?.PocketProvperSpecs?._Error == 'False') {
          if (document.PocketProvperSpecs._row_count === '0') {
            if (Cmd === 'first' || Cmd === 'last') {
              throw 'Пусто';
            } else if (Cmd === 'next') {
              throw 'Вы в конце списка';
            } else if (Cmd === 'prev') {
              throw 'Вы в начале списка';
            } else if (Cmd === 'curr') {
              throw 'reason:' + document.PocketProvperSpecs.Reason;
            } else throw 'Неизвестная ошибка';
          }

          if (document.PocketProvperSpecs._row_count === '0') {
            ERROR_CONSOLE_LOG(
              'PocketProvperSpecs',
              `Накладная ${NumNakl} не найдена`,
            );
            throw 'reason:' + document.PocketProvperSpecs.Reason;
          } else if (document.PocketProvperSpecs.ProvperSpecsRow) {
            return document.PocketProvperSpecs.ProvperSpecsRow;
          }
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
