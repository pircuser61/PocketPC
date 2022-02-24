import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';

export async function UpakovachniyKM(codGood = '') {
  return new Promise((success, fail) => {
    try {
      //console.log(codGood);
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_ora_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL:
          'http://gesweb.m0.maxidom.ru:8080' + '/ws_ora_gate1/ws_ora_gate',
      });

      soapRequest.createRequest({
        'urn:ws_ora_gate': {
          gate2prog: 'none',
          module: 'none',
          userid: 'none',
          wantOraServer: 'jason',
          param4prog:
            '<Services>' +
            '<Head>' +
            '<setService>honest.crpt_pck.get_info_km_ts</setService>' +
            '</Head>' +
            '<Parameters>' +
            '<ciss>' +
            '<cis>' +
            codGood +
            '</cis>' +
            '</ciss>' +
            '<inf>0</inf>' +
            '</Parameters>' +
            '</Services>',
        },
      });

      console.log(
        '\x1b[36m',
        `\n<----------------------------------------------------------------------->
      Начинается запрос в функции UpakovachniyKM (Получение списка гтинов доступных для товара)
      C параметрами:
      codGood:${codGood}
      По ссылке: ${soapRequest.requestURL}
      XML ЗАПРОС В ФУНКЦИИ UpakovachniyKM: \n${soapRequest.xmlRequest}
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
            // console.log(JSON.stringify(responseXMLJS.ServicesResult.OutParameters[0].ServiceResult[0].ciss[0].cis[0].cis_children));
            if (
              responseXMLJS.ServicesResult.Head[0].Error[0].$.errflag ===
              'false'
            ) {
              console.log(
                '\x1b[32m',
                'Функция UpakovachniyKM отработала нормально\n<----------------------------------------------------------------------->',
                '\x1b[0m',
              );
              if (
                responseXMLJS.ServicesResult.OutParameters[0].ServiceResult[0]
                  .ciss[0].cis[0].cis_children[0]
              ) {
                //console.log(JSON.stringify(responseXMLJS.ServicesResult.OutParameters[0].ServiceResult[0].ciss[0].cis[0].cis_children))
                success(
                  responseXMLJS.ServicesResult.OutParameters[0].ServiceResult[0]
                    .ciss[0].cis[0].cis_children,
                );
              } else {
                fail('Список кодов маркировки пуст для ' + codGood);
              }
            }
            if (
              responseXMLJS.ServicesResult.Head[0].Error[0].$.errflag === 'true'
            ) {
              console.log(
                '\x1b[31m',
                `\nПроизошла ошибка в функции AddMarkList\n${responseXMLJS.ServicesResult.Head[0].Error[0]._}\n<----------------------------------------------------------------------->`,
                '\x1b[0m',
              );
              fail(responseXMLJS.ServicesResult.Head[0].Error[0]._);
            }
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
