import SoapRequest from '../soap-client/soapclient';
// @ts-ignore
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {
  createXMLByObject,
  ERROR_CONSOLE_LOG,
  START_REQUEST_LOG,
  SUCCES_CONSOLE_LOG,
  timeout,
  x2js,
} from '../constants/funcrions';
import {PocketProvGoodsSetProps, ProvPalSpecsRow} from '../types/types';

export async function PocketProvGoodsSet({
  City = '',
  UID = '',
  Type = '',
  NumNakl = '',
  NumDoc = '',
  Qty = '0',
  Cmd = null,
  IdNum = '',
  Field2 = '',
}: PocketProvGoodsSetProps) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    /**
 * <PocketProvGoodsSet>           
    <City>1</City>             
    <UID>22064</UID>           
    <Type>0</Type>             
    <NumNakl>86738015</NumNakl>
    <NumDoc>25</NumDoc>        
    <IdNum>6168960800</IdNum>  
    <Cmd>0</Cmd>  <!-- "0" - задать кол-во, "1" - прибавить к тому что есть, "-1" - отнять -->              
    <Qty>0</Qty>               
    <Field2>false</Field2>       <!-- "Только ценник", true/false,  для типов 1 и 5, для остальных должно быть "?", пустой тэг, или не должно быть тэга -->   
</PocketProvGoodsSet>
 */

    let request_body = createXMLByObject('PocketProvGoodsSet', {
      City,
      UID,
      Type,
      NumNakl,
      NumDoc,
      IdNum,
      Qty,
      Cmd,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvGoodsSet,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvGoodsSet',
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
          PocketProvGoodsSet: PocketProvGoodsSet;
        } = x2js.xml2js(responseXML);

        if (document?.PocketProvGoodsSet?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvGoodsSet',
            document?.PocketProvGoodsSet?.Error,
          );
          throw document?.PocketProvGoodsSet?.Error;
        } else if (document?.PocketProvGoodsSet?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvGoodsSet');
          return document.PocketProvGoodsSet;
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}

export interface PocketProvGoodsSet {
  IdNum: string;
  Qty: string;
  _DTTM: string;
  _Error: string;
  _time: string;
  Error: string;
}
