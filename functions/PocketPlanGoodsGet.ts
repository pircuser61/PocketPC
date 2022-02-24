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

export interface Katalog {
  Name: string;
  Art: string;
  Flag: string;
}

export interface Barcod {
  BarCodRow: BarCodRow[] | BarCodRow;
}

export interface GoodsRow {
  CodGood: string;
  Qty: string;
  ByCennic: string;
  Katalog: Katalog;
  Price: string;
  ShopQty: string;
  Barcod: Barcod;
  BcdList?: BarCodRow[];
  ScanBar?: string;
  ScanQuant?: string;
}

export interface PocketPlanGoodsGetAnswer {
  GoodsRow: GoodsRow;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error: string;
}

export interface PocketProvGoodsGetProps {
  City?: string;
  UID?: string;
  Cmd?: 'first' | 'curr' | 'next' | 'prev' | 'last' | 'find' | 'create';
  NumPlan?: string;
  CodGood?: string;
  Barcod?: string;
}

export async function PocketPlanGoodsGet({
  City,
  UID,
  Cmd,
  CodGood,
  NumPlan,
  Barcod,
}: PocketProvGoodsGetProps) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketPlanGoodsGet', {
      City,
      UID,
      Cmd,
      CodGood,
      NumPlan,
      Barcod,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketPlanGoodsGet,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketPlanGoodsGet',
      describe: 'Получить товар в планограмме',
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
          PocketPlanGoodsGet: PocketPlanGoodsGetAnswer;
        } = x2js.xml2js(responseXML);

        if (document?.PocketPlanGoodsGet?._Error == 'True') {
          throw document?.PocketPlanGoodsGet?.Error;
        } else if (document?.PocketPlanGoodsGet?._Error == 'False') {
          if (document.PocketPlanGoodsGet['_row_count'] === '0') {
            throw 'Информации о товаре нет';
          }
          let BcdList: BarCodRow[] = [];
          const BarCodVar =
            document.PocketPlanGoodsGet.GoodsRow.Barcod?.BarCodRow;
          if (Array.isArray(BarCodVar) && !!BarCodVar) {
            BcdList = BarCodVar;
          } else if (!!BarCodVar) {
            BcdList = [BarCodVar];
          }

          return {...document.PocketPlanGoodsGet.GoodsRow, BcdList};
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
            if (document.PocketPlanGoodsGet['_row-count'] === '0') {
              throw 'Информации о товаре нет';
            }
            return document.PocketPlanGoodsGet.ProvPalGoods.GoodsRow;
          } else if (DisplayMode === 'barcod') {
            if (document.PocketPlanGoodsGet['_row-count'] === '0') {
              return [];
            }

            const BarCodVar =
              document.PocketPlanGoodsGet.ProvPalGoods.GoodsRow.BarCod
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
              !document.PocketPlanGoodsGet.ProvPalGoods.GoodsRow.Palett
                .PalettRow
            ) {
              return [];
            }

            const PalettVar =
              document.PocketPlanGoodsGet.ProvPalGoods.GoodsRow.Palett
                .PalettRow;
            if (!PalettVar) {
              return [];
            } else if (Array.isArray(PalettVar)) {
              return PalettVar;
            } else {
              return [PalettVar];
            }
          } else if (DisplayMode === 'Shop') {
            if (document.PocketPlanGoodsGet.ProvPalGoods.GoodsRow.Shop.Error) {
              throw document.PocketPlanGoodsGet.ProvPalGoods.GoodsRow.Shop
                .Error;
            }
            const shops =
              document.PocketPlanGoodsGet.ProvPalGoods.GoodsRow.Shop.ShopRow;
            if (!shops) {
              return [];
            } else if (Array.isArray(shops)) {
              return shops;
            } else {
              return [shops];
            }
          } else if (DisplayMode === 'all') {
            if (document.PocketPlanGoodsGet['_row-count'] === '0') {
              throw 'Информации о товаре нет';
            }

            const barcodelist = [];
            const palletlist = [];
            const choplist = [];

            return {...document.PocketPlanGoodsGet.ProvPalGoods.GoodsRow};
          }
 */
