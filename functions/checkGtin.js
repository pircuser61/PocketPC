import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function checkGtin(codGood) {
  return new Promise((success, fail) => {
    try {
      //console.log(codGood);
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_ora_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_ora_gate1/ws_ora_gate',
      });

      soapRequest.createRequest({
        'urn:ws_ora_gate': {
          gate2prog: 'none',
          module: 'none',
          userid: 'none',
          wantOraServer: 'jason',
          param4prog:
            ' <Services>' +
            '<Head>' +
            '<setService>honest.gtin_pck.get_goods_gtin</setService> ' +
            '</Head>' +
            '<Parameters> ' +
            '<goods>' +
            '<good>' +
            codGood +
            '</good>' +
            '</goods>' +
            '<zak>1</zak>' +
            '</Parameters>' +
            '</Services>',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции checkGtin (Получение списка гтинов доступных для товара)
      C параметрами:
      codGood:${codGood}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ checkGtin: \n${soapRequest.xmlRequest}
      `,

        '\x1b[0m',
      );

      soapRequest
        .sendRequest()
        .then(response => {
          response ? null : fail('Ответ от сервера не пришел');

          let responseXML =
            response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
              'ws_ora_gateResponse'
            ][0]['xmlOut'][0];
          parseString(responseXML, (err, responseXMLJS) => {
            if (
              responseXMLJS['ServicesResult']['OutParameters'][0][
                'ServiceResult'
              ][0]['goods'][0] === ''
            ) {
              fail('Неизвестный товар');
            }
            if (
              responseXMLJS['ServicesResult']['OutParameters'][0][
                'ServiceResult'
              ][0]['goods'][0]
            ) {
              if (
                responseXMLJS['ServicesResult']['OutParameters'][0][
                  'ServiceResult'
                ][0]['goods'][0]['good'][0]['gtin'].length
              ) {
                let gtins = [];
                responseXMLJS['ServicesResult']['OutParameters'][0][
                  'ServiceResult'
                ][0]['goods'][0]['good'][0]['gtin'].map(r => {
                  //console.log(JSON.stringify(r));
                  gtins = [...gtins, r];
                });
                if (gtins.length) {
                  console.log(
                    '\x1b[32m',
                    'Функция checkGtin отработала нормально\n<----------------------------------------------------------------------->',
                    '\x1b[0m',
                  );

                  success(gtins);
                } else fail('Список гтинов пуст');
              }
            }
            //console.log(!responseXMLJS["ServicesResult"]["OutParameters"][0]["ServiceResult"][0]["goods"][0]);
            //
          });

          fail('Возникла ошибка');
        })
        .catch(error => {
          fail('' + error);
        });
    } catch (error) {
      fail('' + error);
    }
  });
}

// <?xml version="1.0" encoding="utf-8"?>
// <Services>
//     <Head>
//         <setService>honest.gtin_pck.get_goods_gtin</setService>
//     </Head>
//     <Parameters>
//         <goods>
//             <good>1</good>
//             <good>2</good>
//             <good>1001306355</good>
//             <good>1001301661</good>
//         </goods>
//         <zak>1</zak>
//     </Parameters>
// </Services>
