import SoapRequest from '../soap-client/soapclient';
import { parseString } from 'react-native-xml2js';
import { uri } from '../connectInfo';


export async function PocketAvailShops(UID='',City='') {
    return new Promise((success, fail) => {
        try {
            const soapRequest = new SoapRequest({});
            soapRequest.InitParams({
                targetNamespace: 'urn:gestori-gate:ws_gate',
                targetPrefix: 'urn',
                SoapAction: '',
                requestURL: uri + '/ws_gate'+City+'/ws_gate',
            });

            soapRequest.createRequest({
                'urn:ws_gate': {
                    gate2prog: 'PocketAvailShops,mobileGes',
                    param4prog:
                        '<?xml version="1.0" encoding="utf-8" ?>' +
                        '<PocketAvailShops>' +
                        '<City>'+City+'</City>' +
                        '<UID>'+UID+'</UID>' +
                        '</PocketAvailShops>',
                    wantDbTo: 'ges-local',
                },
            });
            console.log('\x1b[36m', `\n<----------------------------------------------------------------------->
            Начинается запрос в функции PocketAvailShops ( Получение списка доступных объединений )
            C параметрами:
            UID:${UID}
            По ссылке: ${soapRequest.requestURL}
            XML ЗАПРОС В ФУНКЦИИ VZAK: \n${soapRequest.xmlRequest}
            `
            
        ,'\x1b[0m');
      
            soapRequest
                .sendRequest()
                .then(response => {
                    !response ? fail('Пришел пустой ответ') : null;
                    if (
                        response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['SOAP-ENV:Fault']
                    ) {
                        fail('Неподходящий формат баркода');
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
                        parseString(responseXML, (err, responseXMLJS) => {
                           if(responseXMLJS.PocketAvailShops.$.Error==='False'){
                            console.log('\x1b[32m','Функция PocketAvailShops отработала нормально\n<----------------------------------------------------------------------->' ,'\x1b[0m');

                            success(responseXMLJS["PocketAvailShops"]['ObShop']);
                        }
                           if(responseXMLJS.PocketAvailShops.$.Error==='True'){
                            fail(responseXMLJS.PocketAvailShops.Error[0])
                           }
                        });

                    }
                    fail('Произошла ошибка')
                })
                .catch(error => {
                    fail('' + error);
                });
        } catch (error) {
            fail('' + error);
        }
    });
}
