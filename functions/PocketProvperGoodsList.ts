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
import {PocketProvperGoodsListProps} from '../types/types';
import {Alert} from 'react-native';

export async function PocketProvperGoodsList({
  City = '',
  UID = '',
  Type = '1',
  NumProv = '',
  NumNakl = '',
  CheckShipment = false,
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
 * <PocketProvperGoodsList>              
    <City>1</City>             
    <UID>9604</UID>            
    <Type>6</Type>             
    <NumNakl>79556976</NumNakl>
    <Shop>701</Shop>           
</PocketProvperGoodsList> 
 */

    let request_body = createXMLByObject('PocketProvperGoodsList', {
      City,
      UID,
      Type,
      NumProv,
      NumNakl,
      CheckShipment: CheckShipment ? 'true' : '',
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvperGoodsList,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvperGoodsList ' + Type,
      describe: 'Получить список в проверке накладных',
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
          PocketProvperGoodsList: PocketProvperGoodsListProps;
        } = x2js.xml2js(responseXML);
        //console.log(JSON.stringify(document));

        if (document?.PocketProvperGoodsList?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvperGoodsList',
            document?.PocketProvperGoodsList?.Error,
          );
          throw document?.PocketProvperGoodsList?.Error;
        } else if (document?.PocketProvperGoodsList?._Error == 'False') {
          if (document.PocketProvperGoodsList.WasShipment === 'true') {
            Alert.alert('Внимание!', 'Была отгрузка товара по накладной!');
          }
          SUCCES_CONSOLE_LOG('PocketProvperGoodsList');
          if (document.PocketProvperGoodsList._row_count === '0') return [];
          else {
            if (
              Array.isArray(
                document.PocketProvperGoodsList.ProvperGoods.ProvperGoodsRow,
              )
            ) {
              return document.PocketProvperGoodsList.ProvperGoods
                .ProvperGoodsRow;
            } else {
              return [
                document.PocketProvperGoodsList.ProvperGoods.ProvperGoodsRow,
              ];
            }
          }
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
