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
import {PocketProvGoodsDeleteProps} from '../types/ProverkaTypes';

export async function PocketProvGoodsDelete({
  UID = '',
  City = '',
  Type = '',
  NumNakl = '',
  NumDoc = '',
  IdNum = '',
  CodGood = '',
  All = '',
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });
    let request_body = createXMLByObject('PocketProvGoodsDelete', {
      City,
      UID,
      NumNakl,
      NumDoc,
      IdNum,
      CodGood,
      All,
      Type,
    });
    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvGoodsDelete,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvGoodsDelete ' + Type,
      describe: 'Удалить проверку на покете',
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

        const document: {
          PocketProvGoodsDelete: PocketProvGoodsDeleteProps;
        } = x2js.xml2js(responseXML);

        if (document?.PocketProvGoodsDelete?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvGoodsDelete',
            document?.PocketProvGoodsDelete?.Error,
          );
          throw document?.PocketProvGoodsDelete?.Error;
        } else if (document?.PocketProvGoodsDelete?._Error == 'False') {
          if (document.PocketProvGoodsDelete['_row-count'] === '0') {
            throw 'Информации о товаре нет';
          }
          return document.PocketProvGoodsDelete.ProvPalGoods.GoodsRow;
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
