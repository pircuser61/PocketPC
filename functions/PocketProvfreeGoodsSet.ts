//PocketProvfreeGoodsSet
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

export async function PocketProvfreeGoodsSet({
  City = '',
  UID = '',
  CurrShop = '',
  IdNum = '',
  Qty = '',
  Cmd = '',
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    /**
     * <PocketProvfreeGoodsSet>     
    <City>1</City>           
    <UID>9604</UID>          
    <CurrShop>901</CurrShop> 
    <IdNum>6229991316</IdNum>
    <Qty>2</Qty>             
    <Cmd>0</Cmd>             
</PocketProvfreeGoodsSet>
     */

    let request_body = createXMLByObject('PocketProvfreeGoodsSet', {
      City,
      UID,
      CurrShop,
      IdNum,
      Qty,
      Cmd,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvfreeGoodsSet,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvfreeGoodsSet',
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
          PocketProvfreeGoodsSet: PocketProvfreeGoodsSet;
        } = x2js.xml2js(responseXML);

        if (document?.PocketProvfreeGoodsSet?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvfreeGoodsSet',
            document?.PocketProvfreeGoodsSet?.Error,
          );
          throw document?.PocketProvfreeGoodsSet?.Error;
        } else if (document?.PocketProvfreeGoodsSet?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvfreeGoodsSet');
          return document.PocketProvfreeGoodsSet;
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}

export interface PocketProvfreeGoodsSet {
  IdNum: string;
  Qty: string;
  _DTTM: string;
  _Error: string;
  _time: string;
  Error: string;
}
