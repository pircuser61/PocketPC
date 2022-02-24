//PocketPlanGoodsQty
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
import {ProvPalSpecsRow} from '../types/types';

export async function PocketPlanGoodsQty({
  City = '',
  UID = '',
  Cmd = '',
  NumPlan = '',
  CodGood = '',
  Qty = '',
  ByCennic = '',
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketPlanGoodsQty', {
      City,
      UID,
      NumPlan,
      CodGood,
      Qty,
      Cmd,
      ByCennic,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketPlanGoodsQty,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketPlanGoodsQty',
      describe: 'Редактировать товар в проверке на покете',
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
          PocketPlanGoodsQty: PocketPlanGoodsQty;
        } = x2js.xml2js(responseXML);

        if (document?.PocketPlanGoodsQty?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketPlanGoodsQty',
            document?.PocketPlanGoodsQty?.Error,
          );
          throw document?.PocketPlanGoodsQty?.Error;
        } else if (document?.PocketPlanGoodsQty?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketPlanGoodsQty');
          return document.PocketPlanGoodsQty;
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}

export interface PocketPlanGoodsQty {
  IdNum: string;
  Qty: string;
  _DTTM: string;
  _Error: string;
  _time: string;
  Error: string;
}
