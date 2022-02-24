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
import {BarCodRow, ProvPalSpecsRow, Shop, TaskStatus} from '../types/types';

export interface Place {
  NumStel: string;
  NumSec: string;
  NumPl: string;
  _type: string;
}

export interface TaskEmpty {
  TaskId: string;
  TaskStatus: TaskStatus;
  TaskMessage: string;
}

export interface Plan {
  NumPlan: string;
  CodShop: string;
  CodDep: string;
  Place: Place;
  TaskEmpty: TaskEmpty;
}

export interface PocketPlanGetAnswer {
  Plan: Plan;
  _DTTM: string;
  _Error: string;
  _row_count: string;
  _time: string;
  Error: string;
}

export interface PocketPlanGetProps {
  City?: string;
  UID?: string;
  Cmd?: 'first' | 'curr' | 'next' | 'prev' | 'last';
  NumPlan?: string;
  CodShop?: string;
}

export async function PocketPlanGet({
  City = '',
  UID = '',
  Cmd,
  CodShop,
  NumPlan,
}: PocketPlanGetProps) {
  try {
    const soapRequest = new SoapRequest({});
    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketPlanGet', {
      City,
      UID,
      Cmd,
      CodShop,
      NumPlan,
    });

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketPlanGet,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketPlanGet',
      describe: 'Получить планограмму',
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
          PocketPlanGet: PocketPlanGetAnswer;
        } = x2js.xml2js(responseXML);

        if (document?.PocketPlanGet?._Error == 'True') {
          throw document?.PocketPlanGet?.Error;
        } else if (document?.PocketPlanGet?._Error == 'False') {
          if (document.PocketPlanGet._row_count === '0') {
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
          } else return document.PocketPlanGet.Plan;
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
            if (document.PocketPlanGet['_row-count'] === '0') {
              throw 'Информации о товаре нет';
            }
            return document.PocketPlanGet.ProvPalGoods.GoodsRow;
          } else if (DisplayMode === 'barcod') {
            if (document.PocketPlanGet['_row-count'] === '0') {
              return [];
            }

            const BarCodVar =
              document.PocketPlanGet.ProvPalGoods.GoodsRow.BarCod
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
              !document.PocketPlanGet.ProvPalGoods.GoodsRow.Palett
                .PalettRow
            ) {
              return [];
            }

            const PalettVar =
              document.PocketPlanGet.ProvPalGoods.GoodsRow.Palett
                .PalettRow;
            if (!PalettVar) {
              return [];
            } else if (Array.isArray(PalettVar)) {
              return PalettVar;
            } else {
              return [PalettVar];
            }
          } else if (DisplayMode === 'Shop') {
            if (document.PocketPlanGet.ProvPalGoods.GoodsRow.Shop.Error) {
              throw document.PocketPlanGet.ProvPalGoods.GoodsRow.Shop
                .Error;
            }
            const shops =
              document.PocketPlanGet.ProvPalGoods.GoodsRow.Shop.ShopRow;
            if (!shops) {
              return [];
            } else if (Array.isArray(shops)) {
              return shops;
            } else {
              return [shops];
            }
          } else if (DisplayMode === 'all') {
            if (document.PocketPlanGet['_row-count'] === '0') {
              throw 'Информации о товаре нет';
            }

            const barcodelist = [];
            const palletlist = [];
            const choplist = [];

            return {...document.PocketPlanGet.ProvPalGoods.GoodsRow};
          }
 */
