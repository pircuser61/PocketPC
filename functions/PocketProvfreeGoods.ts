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
import {Alert} from 'react-native';

export interface BarCodRow {
  Cod: string;
  Quant: string;
  CodLevel: string;
}

export interface BarCod {
  BarCodRow: BarCodRow[];
}

export interface ShopRow {
  NN: string;
  CodShop: string;
  Qty: string;
  Sold: string;
}

export interface Shop {
  ShopRow: ShopRow[];
}
export interface Place {
  CodDep: string;
  NumStel: string;
  NumSec: string;
  NumPl: string;
  _type: string;
}

export interface PlanRow {
  NumPlan: string;
  Qty: string;
  Place: Place;
  PlaceStr: string;
}

export interface Plan {
  PlanRow: PlanRow | PlanRow[];
}

export interface UcenRow {
  Cod: string;
  Quant: string;
  CodLevel: string;
  Qty: string;
  Date: string;
  CodShop?: string;
}

export interface Ucen {
  UcenRow: UcenRow[];
}

export interface PalettRow {
  NumPal: string;
  CodShop: string;
  Qty: string;
}

export interface Palett {
  PalettRow: PalettRow[];
}

export interface GoodsRow {
  GroupCod: string;
  IdNum: string;
  MeasCod: string;
  MeasName: string;
  CodGood: string;
  ScanBarCod: string;
  Qty: string;
  ScanBarQuant: string;
  Price: string;
  LastSale: string;
  ShopQty: string;
  TypeCen: string;
  DepName: string;
  GroupName: string;
  ManufCod: string;
  ManufName: string;
  CountryCod: string;
  CountryName: string;
  KatName: string;
  KatFlag: string;
  KatArt: string;
  Meas: string;
  SupplCod: string;
  SupplName: string;
  BarCod: BarCod;
  Ucen: Ucen;
  Palett: Palett;
  Shop: Shop;
  Plan?: Plan;
  BcdList: BarCodRow[];
  ShopsList: ShopRow[];
  PalletsList: PalettRow[];
  PlanList: PlanRow[];
  UcenList: UcenRow[];
}

export interface PocketProvfreeGoodsAnswer {
  GoodsRow: GoodsRow;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error: string;
}

export async function PocketProvfreeGoods({
  City = '',
  UID = '',
  CurrShop = '',
  NumNakl = '',
  Cmd = '',
  CodGood = '',
  Barcod = '',
}) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketProvfreeGoods', {
      City,
      UID,
      CurrShop,
      NumNakl,
      Cmd,
      CodGood,
      Barcod,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvfreeGoods,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvfreeGoods ',
      describe: 'Получить список в проверке выкладки',
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
          PocketProvfreeGoods: PocketProvfreeGoodsAnswer;
        } = x2js.xml2js(responseXML);
        console.log(JSON.stringify(document));

        if (document?.PocketProvfreeGoods?._Error == 'True') {
          ERROR_CONSOLE_LOG(
            'PocketProvfreeGoods',
            document?.PocketProvfreeGoods?.Error,
          );
          throw document?.PocketProvfreeGoods?.Error;
        } else if (document?.PocketProvfreeGoods?._Error == 'False') {
          SUCCES_CONSOLE_LOG('PocketProvfreeGoods');
          if (document.PocketProvfreeGoods._row_count === '0') {
            if (Cmd === 'first' || Cmd === 'last') {
              throw 'Пусто';
            } else if (Cmd === 'next') {
              throw 'Вы в конце списка';
            } else if (Cmd === 'prev') {
              throw 'Вы в начале списка';
            } else if (Cmd === 'curr') {
              throw 'Ошибка поиска текущей паллеты';
            }
            throw 'Информации о товаре нет';
          }

          let BcdList: BarCodRow[] = [];
          const BarCodVar =
            document.PocketProvfreeGoods.GoodsRow.BarCod.BarCodRow;
          if (Array.isArray(BarCodVar) && !!BarCodVar) {
            BcdList = BarCodVar;
          } else if (!!BarCodVar) {
            BcdList = [BarCodVar];
          }

          let ShopsList: ShopRow[] = [];
          const ShopVar = document.PocketProvfreeGoods.GoodsRow.Shop.ShopRow;
          if (Array.isArray(ShopVar) && !!ShopVar) {
            ShopsList = ShopVar;
          } else if (!!ShopVar) {
            ShopsList = [ShopVar];
          }

          let PalletsList: PalettRow[] = [];
          const PalletsVar =
            document.PocketProvfreeGoods.GoodsRow.Palett.PalettRow;
          if (Array.isArray(PalletsVar) && !!PalletsVar) {
            PalletsList = PalletsVar;
          } else if (!!PalletsVar) {
            PalletsList = [PalletsVar];
          }

          let PlanList: PlanRow[] = [];
          const PlanssVar =
            document.PocketProvfreeGoods.GoodsRow?.Plan?.PlanRow;
          if (Array.isArray(PlanssVar) && !!PlanssVar) {
            PlanList = PlanssVar;
          } else if (!!PlanssVar) {
            PlanList = [PlanssVar];
          }

          let UcenList: UcenRow[] = [];
          const UcenssVar =
            document.PocketProvfreeGoods.GoodsRow?.Ucen?.UcenRow;
          if (Array.isArray(UcenssVar) && !!UcenssVar) {
            UcenList = UcenssVar;
          } else if (!!UcenssVar) {
            UcenList = [UcenssVar];
          }

          return {
            ...document.PocketProvfreeGoods.GoodsRow,
            ShopsList,
            BcdList,
            PalletsList,
            PlanList,
            UcenList,
          };
        }
      }
    }
    throw 'Неизвестная ошибка!';
  } catch (error) {
    throw error;
  }
}
