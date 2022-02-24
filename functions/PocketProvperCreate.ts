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
import {BarCodRow, PalettRow, ShopRow} from '../types/ProverkaTypes';
import {Provper, ProvperRow} from '../types/types';

export interface PocketProvperCreateAnswer {
  NumProv: string;
  _DTTM: string;
  _Error: string;
  _time: string;
  Error: string;
  Provper: Provper;
}

export async function PocketProvperCreate({
  City = '',
  UID = '',
  Type = '',
  CodShop = '',
  Comment = '',
  FillSpecs = '',
  CheckFactQty = '',
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketProvperCreate', {
      City,
      UID,
      Type,
      CodShop,
      Comment,
      FillSpecs,
      CheckFactQty,
      FilterShop: CodShop,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvperCreate,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvperCreate',
      describe: 'Добавить товар в проверку на покете',
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
          PocketProvperCreate: PocketProvperCreateAnswer;
        } = x2js.xml2js(responseXML);

        console.log(JSON.stringify(document));

        if (document?.PocketProvperCreate?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvperCreate',
            document?.PocketProvperCreate?.Error,
          );
          throw document?.PocketProvperCreate?.Error;
        } else if (document?.PocketProvperCreate?._Error == 'False') {
          //console.log(JSON.stringify(document));
          SUCCES_CONSOLE_LOG('PocketProvperCreate');
          const {NumProv, Provper} = document.PocketProvperCreate;
          let newList: ProvperRow[] = [];
          if (!Provper.ProvperRow) {
          } else {
            if (Array.isArray(Provper.ProvperRow)) {
              newList = Provper.ProvperRow;
            } else {
              newList = [Provper.ProvperRow];
            }
          }

          return {CodShop, Comment, NumProv, Provper: newList};
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
