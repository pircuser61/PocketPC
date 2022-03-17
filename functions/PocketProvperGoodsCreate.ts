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
import {
  BarCodRow,
  PalettRow,
  PocketProvperGoodsCreateProps,
  ShopRow,
} from '../types/ProverkaTypes';

export async function PocketProvperGoodsCreate({
  City = '',
  UID = '',
  Type = '',
  NumProv = '',
  NumNakl = '',
  BarCod = '',
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
 * <PocketProvperGoodsCreate>      
    <City>1</City>              
    <UID>22064</UID>            
    <NumProv>87047961</NumProv> 
    <NumNakl>82707000</NumNakl> 
    <BarCod>1001337315</BarCod> 
</PocketProvperGoodsCreate>
 */

    let request_body = createXMLByObject('PocketProvperGoodsCreate', {
      City,
      UID,
      Type,
      NumNakl,
      BarCod,
      NumProv,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvperGoodsCreate,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvperGoodsCreate',
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
          PocketProvperGoodsCreate: PocketProvperGoodsCreateProps;
        } = x2js.xml2js(responseXML);

        console.log(JSON.stringify(document));

        if (document?.PocketProvperGoodsCreate?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvperGoodsCreate',
            document?.PocketProvperGoodsCreate?.Error,
          );
          throw document?.PocketProvperGoodsCreate?.Error;
        } else if (document?.PocketProvperGoodsCreate?._Error == 'False') {
          if (document?.PocketProvperGoodsCreate._row_count === '0') {
            throw 'Нулевое количество в ответе, row_count = 0!';
          }
          SUCCES_CONSOLE_LOG('PocketProvperGoodsCreate');
          return document.PocketProvperGoodsCreate.ProvperGoods.ProvperGoodsRow;
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
