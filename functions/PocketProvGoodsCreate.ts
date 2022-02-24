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
  PocketProvGoodsCreateProps,
  ShopRow,
} from '../types/ProverkaTypes';

export async function PocketProvGoodsCreate({
  City = '',
  UID = '',
  Type = '',
  NumNakl = '',
  NumDoc = '',
  BarCod = '',
  DisplayShop = '',
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
 * <PocketProvGoodsCreate>           
    <City>1</City>             
    <UID>22064</UID>           
    <Type>6</Type>             
    <Shop>701</Shop>           
    <NumNakl>86705696</NumNakl>
    <NumDoc>5166936</NumDoc>   
    <Cmd>first</Cmd>           
    <DisplayMode/>             
    <All>true</All>            
    <CodGood>0</CodGood>       
    <IdNum>0</IdNum>           
</PocketProvGoodsCreate>
 */

    let request_body = createXMLByObject('PocketProvGoodsCreate', {
      City,
      UID,
      Type,
      NumNakl,
      NumDoc,
      BarCod,
      DisplayMode: 'all',
      DisplayShop,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvGoodsCreate,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvGoodsCreate',
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
          PocketProvGoodsCreate: PocketProvGoodsCreateProps;
        } = x2js.xml2js(responseXML);

        //console.log(JSON.stringify(document));

        if (document?.PocketProvGoodsCreate?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvGoodsCreate',
            document?.PocketProvGoodsCreate?.Error,
          );
          throw document?.PocketProvGoodsCreate?.Error;
        } else if (document?.PocketProvGoodsCreate?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvGoodsCreate');

          let BcdList: BarCodRow[] = [];
          const BarCodVar =
            document.PocketProvGoodsCreate.ProvPalGoods.GoodsRow?.BarCod
              ?.BarCodRow;
          if (Array.isArray(BarCodVar) && !!BarCodVar) {
            BcdList = BarCodVar;
          } else if (!!BarCodVar) {
            BcdList = [BarCodVar];
          }

          let PalletsList: PalettRow[] = [];
          const PalettVar =
            document.PocketProvGoodsCreate.ProvPalGoods.GoodsRow?.Palett
              ?.PalettRow;
          if (Array.isArray(PalettVar) && !!PalettVar) {
            PalletsList = PalettVar;
          } else if (!!PalettVar) {
            PalletsList = [PalettVar];
          }

          let ShopsList: ShopRow[] = [];
          const ShopVar =
            document.PocketProvGoodsCreate.ProvPalGoods.GoodsRow?.Shop?.ShopRow;
          if (Array.isArray(ShopVar) && !!ShopVar) {
            ShopsList = ShopVar;
          } else if (!!ShopVar) {
            ShopsList = [ShopVar];
          }
          //SUCCES_CONSOLE_LOG('PocketProvGoodsCreate');
          return {
            ...document.PocketProvGoodsCreate.ProvPalGoods.GoodsRow,
            PalletsList,
            ShopsList,
            BcdList,
          };
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
