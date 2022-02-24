import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {
  createXMLByObject,
  ERROR_CONSOLE_LOG,
  START_REQUEST_LOG,
  SUCCES_CONSOLE_LOG,
  x2js,
} from '../constants/funcrions';

export async function PocketProvList({
  FilterShop = '',
  Type = '',
  UID = '',
  City = '',
}) {
  try {
    const soapRequest = new SoapRequest({});

    soapRequest.InitParams({
      targetNamespace: 'urn:gestori-gate:ws_gate',
      targetPrefix: 'urn',
      SoapAction: '',
      requestURL: uri + '/ws_gate' + City + '/ws_gate',
    });

    let request_body = createXMLByObject('PocketProvList', {
      City,
      UID,
      Type,
      FilterShop,
    });

    soapRequest.timeout = 10000;

    soapRequest.createRequest({
      'urn:ws_gate': {
        gate2prog: 'PocketProvList,mobileGes',
        param4prog: request_body,
        wantDbTo: 'ges-local',
      },
    });

    START_REQUEST_LOG({
      body: request_body,
      serviceName: 'PocketProvList',
      describe: 'Список проверок на покете',
      url: soapRequest.requestURL,
    });

    let response = await soapRequest.sendRequest();
    if (!response) {
      throw 'Пришел пустой ответ';
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

      let json = x2js.xml2js(responseXML);
      //console.log(responseXML);
      if (json?.PocketProvList?._Error === 'False') {
        SUCCES_CONSOLE_LOG('PocketProvList');
        if (json?.PocketProvList?._row_count === '0') {
          return [];
        } else {
          return Array.isArray(json?.PocketProvList?.ProvPal?.ProvPalRow)
            ? json?.PocketProvList?.ProvPal?.ProvPalRow
            : [json?.PocketProvList?.ProvPal?.ProvPalRow];
        }
      }
      if (json?.PocketProvList?._Error === 'True') {
        ERROR_CONSOLE_LOG('PocketProvList', json.PocketProvList.Error);
        throw json.PocketProvList.Error;
      }
    }

    throw 'Неизвестная ошибка';
  } catch (error) {
    throw error;
  }
}

/**
{
   "PocketProvList":{
      "ProvPal":{
         "ProvPalRow":[
            {
               "Flag":"#",
               "ID":"79556971",
               "Comment":"ценники дом",
               "CodShop":"701",
               "CodDep":"4",
               "UID":""
            },
            {
               "Flag":"#",
               "ID":"79556976",
               "Comment":"ценники сад",
               "CodShop":"701",
               "CodDep":"1",
               "UID":""
            },
            {
               "Flag":"#",
               "ID":"79700854",
               "Comment":"Инвент канцтовары",
               "CodShop":"701",
               "CodDep":"1",
               "UID":""
            },
            {
               "Flag":"#",
               "ID":"81327499",
               "Comment":"перепроверка нг",
               "CodShop":"701",
               "CodDep":"1",
               "UID":""
            },
            {
               "Flag":"#",
               "ID":"84833894",
               "Comment":"Михеева",
               "CodShop":"701",
               "CodDep":"1",
               "UID":"9604"
            },
            {
               "Flag":"#",
               "ID":"85071994",
               "Comment":"Проверка ТДС",
               "CodShop":"701",
               "CodDep":"1",
               "UID":""
            },
            {
               "Flag":"#",
               "ID":"85890815",
               "Comment":"канцелярия возврат",
               "CodShop":"701",
               "CodDep":"1",
               "UID":""
            },
            {
               "Flag":"#",
               "ID":"86338559",
               "Comment":"Канцелярия Леонтьева",
               "CodShop":"701",
               "CodDep":"1",
               "UID":""
            },
            {
               "Flag":"#",
               "ID":"86379979",
               "Comment":"КАНЦЕЛЯРИЯ ИНВЕНТ",
               "CodShop":"701",
               "CodDep":"1",
               "UID":""
            },
            {
               "Flag":"#",
               "ID":"86434826",
               "Comment":"Михеева",
               "CodShop":"701",
               "CodDep":"1",
               "UID":"9604"
            }
         ]
      },
      "_DTTM":"03.11.21 12:46:59",
      "_Error":"False",
      "_row_count":"10"
   }
}

 */
