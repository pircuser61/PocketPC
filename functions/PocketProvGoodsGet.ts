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
import {BarCodRow, ProvPalSpecsRow, Shop} from '../types/types';
import {
  GoodsRow,
  PalettRow,
  PlanRow,
  PocketProvGoodsGetAnswer,
  ShopRow,
} from '../types/ProverkaTypes';

export interface PocketProvGoodsGetProps {
  City?: string;
  UID?: string;
  Type?: string;
  NumNakl?: string;
  NumDoc?: string;
  Cmd?: 'first' | 'curr' | 'next' | 'prev';
  DisplayMode?: 'katalog' | 'barcod' | 'palett' | 'Shop' | 'all';
  All?: 'true' | 'false';
  CodGood?: string;
  IdNum?: string;
  Item?: GoodsRow;
  Shop?: string;
}

export async function PocketProvGoodsGet({
  City = '',
  UID = '',
  Type = '',
  NumNakl = '',
  NumDoc = '',
  Cmd,
  DisplayMode,
  All,
  CodGood = '',
  IdNum = '',
  Shop = '',
}: PocketProvGoodsGetProps) {
  try {
    // await timeout(2000);
    // throw 'test';

    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketProvGoodsGet', {
      City,
      UID,
      Type,
      NumNakl,
      NumDoc,
      Cmd,
      DisplayMode,
      All,
      CodGood,
      Shop,
      IdNum,
      DisplayShop: Shop,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvGoodsGet,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvGoodsGet ' + DisplayMode,
      describe: 'Получить список баркодов/товаров/много чего',
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
          PocketProvGoodsGet: PocketProvGoodsGetAnswer;
        } = x2js.xml2js(responseXML);

        if (document?.PocketProvGoodsGet?._Error == 'True') {
          throw document?.PocketProvGoodsGet?.Error;
        } else if (document?.PocketProvGoodsGet?._Error == 'False') {
          if (DisplayMode === 'all') {
            if (document.PocketProvGoodsGet['_row-count'] === '0') {
              throw 'Информации о товаре нет';
            }

            let BcdList: BarCodRow[] = [];
            const BarCodVar =
              document.PocketProvGoodsGet.ProvPalGoods.GoodsRow.BarCod
                .BarCodRow;
            if (Array.isArray(BarCodVar) && !!BarCodVar) {
              BcdList = BarCodVar;
            } else if (!!BarCodVar) {
              BcdList = [BarCodVar];
            }

            let PalletsList: PalettRow[] = [];
            const PalettVar =
              document.PocketProvGoodsGet.ProvPalGoods.GoodsRow.Palett
                .PalettRow;
            if (Array.isArray(PalettVar) && !!PalettVar) {
              PalletsList = PalettVar;
            } else if (!!PalettVar) {
              PalletsList = [PalettVar];
            }

            let ShopsList: ShopRow[] = [];
            const ShopVar =
              document.PocketProvGoodsGet.ProvPalGoods.GoodsRow.Shop.ShopRow;
            if (Array.isArray(ShopVar) && !!ShopVar) {
              ShopsList = ShopVar;
            } else if (!!ShopVar) {
              ShopsList = [ShopVar];
            }
            let PlanogramPlaceList: PlanRow[] = [];
            const PlanogramPlaceVar =
              document.PocketProvGoodsGet.ProvPalGoods.GoodsRow.Plan.PlanRow;
            if (Array.isArray(PlanogramPlaceVar) && !!PlanogramPlaceVar) {
              PlanogramPlaceList = PlanogramPlaceVar;
            } else if (!!PlanogramPlaceVar) {
              PlanogramPlaceList = [PlanogramPlaceVar];
            }
            SUCCES_CONSOLE_LOG(
              'PocketProvGoodsGet, ( DisplayMode: ' + DisplayMode + ' )',
            );
            return {
              ...document.PocketProvGoodsGet.ProvPalGoods.GoodsRow,
              PalletsList,
              ShopsList,
              BcdList,
              PlanogramPlaceList,
            };
          }
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}

/**
 * if (DisplayMode === 'katalog') {
            if (document.PocketProvGoodsGet['_row-count'] === '0') {
              throw 'Информации о товаре нет';
            }
            return document.PocketProvGoodsGet.ProvPalGoods.GoodsRow;
          } else if (DisplayMode === 'barcod') {
            if (document.PocketProvGoodsGet['_row-count'] === '0') {
              return [];
            }

            const BarCodVar =
              document.PocketProvGoodsGet.ProvPalGoods.GoodsRow.BarCod
                .BarCodRow;
            if (!BarCodVar) {
              return [];
            }

            if (Array.isArray(BarCodVar)) {
              return BarCodVar;
            } else {
              return [BarCodVar];
            }
          } else if (DisplayMode === 'palett') {
            if (
              !document.PocketProvGoodsGet.ProvPalGoods.GoodsRow.Palett
                .PalettRow
            ) {
              return [];
            }

            const PalettVar =
              document.PocketProvGoodsGet.ProvPalGoods.GoodsRow.Palett
                .PalettRow;
            if (!PalettVar) {
              return [];
            } else if (Array.isArray(PalettVar)) {
              return PalettVar;
            } else {
              return [PalettVar];
            }
          } else if (DisplayMode === 'Shop') {
            if (document.PocketProvGoodsGet.ProvPalGoods.GoodsRow.Shop.Error) {
              throw document.PocketProvGoodsGet.ProvPalGoods.GoodsRow.Shop
                .Error;
            }
            const shops =
              document.PocketProvGoodsGet.ProvPalGoods.GoodsRow.Shop.ShopRow;
            if (!shops) {
              return [];
            } else if (Array.isArray(shops)) {
              return shops;
            } else {
              return [shops];
            }
          } else if (DisplayMode === 'all') {
            if (document.PocketProvGoodsGet['_row-count'] === '0') {
              throw 'Информации о товаре нет';
            }

            const barcodelist = [];
            const palletlist = [];
            const choplist = [];

            return {...document.PocketProvGoodsGet.ProvPalGoods.GoodsRow};
          }
 */
