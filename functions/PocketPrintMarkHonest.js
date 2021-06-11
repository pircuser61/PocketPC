import SoapRequest from '../soap-client/soapclient';
import {parseString} from 'react-native-xml2js';
import {uri} from '../connectInfo';
import {toUTF8Array} from './checkTypes';
//http://109.124.66.52:8880
export async function PocketPrintMarkHonest(
  printer,
  GTIN = '',
  serial = '',
  QR = '',
  CodGood,
  City,
  UID,
  Country = '', //GtinAndSerial.gtinInfo.country[0]['_']
  Name = '', // GtinAndSerial.gtinInfo.name[0]['_'],
  Size = '', //GtinAndSerial.gtinInfo["productsize"][0]['_']
  Brand = '', //GtinAndSerial.gtinInfo.brand[0]['_']
  Model = '', //GtinAndSerial.gtinInfo["model"][0]['_']
) {
  return new Promise((success, fail) => {
    try {
      const soapRequest = new SoapRequest({});
      soapRequest.InitParams({
        targetNamespace: 'urn:gestori-gate:ws_gate',
        targetPrefix: 'urn',
        SoapAction: '',
        requestURL: uri + '/ws_gate' + City + '/ws_gate',
      });

      console.log(
        'ПРИНТЕР:' + printer,
        '\nГТИН' + GTIN,
        '\nСерия' + serial,
        '\nКод товара' + CodGood,
        '\nГород' + City,
        '\nЮзерАйди' + UID,
      );
      soapRequest.createRequest({
        'urn:ws_gate': {
          gate2prog: 'PocketPrintMarkHonest,mobileGes',
          param4prog:
            '<?xml version="1.0" encoding="utf-8" ?>' +
            '<PocketPrintMarkHonest>' +
            '<City>' +
            City +
            '</City>' +
            '<UID>' +
            UID +
            '</UID>' +
            '<Printer>' +
            printer +
            '</Printer>' +
            '<QR>' +
            QR.replace(/&/g, '&amp;')
              .replace(/</g, '&lt;')
              .split('')
              .map(r => {
                if (toUTF8Array(r) == 29) {
                  return '&#x001d;';
                } else return r;
              })
              .join('') +
            '</QR>' +
            '<CodGood>' +
            CodGood +
            '</CodGood>' +
            '<Country>' +
            Country +
            '</Country>' +
            '<Name>' +
            Name +
            '</Name>' +
            '<Size>' +
            Size +
            '</Size>' +
            '<Brand>' +
            Brand +
            '</Brand>' +
            '<Model>' +
            Model +
            '</Model>' +
            '</PocketPrintMarkHonest>',
          wantDbTo: 'ges-local',
        },
      });
      console.log(soapRequest.xmlRequest);
      soapRequest
        .sendRequest()
        .then(response => {
          response ? null : fail('Пришел пустой ответ');
          let responseXML =
            response['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
              'ns1:ws_gateResponse'
            ][0]['xmlOut'][0]['_'];

          parseString(responseXML, (err, responseXMLJS) => {
            console.log(responseXMLJS);
            if (
              responseXMLJS['PocketPrintMarkHonest']['$']['Error'] === 'True'
            ) {
              fail(responseXMLJS['PocketPrintMarkHonest']['Error']);
            }
            if (
              responseXMLJS['PocketPrintMarkHonest']['$']['Error'] === 'False'
            ) {
              success(responseXMLJS['PocketPrintMarkHonest']['Result'][0]);
            }
            fail('Неизвестная ошибка');
          });
          // alert(JSON.stringify(response));
        })
        .catch(error => {
          fail('' + error);
        });
    } catch (error) {
      fail('' + error);
    }
  });
}

/*<PocketPrintMarkHonest>
    <City>1</City>
    <UID>22064</UID>          <!--  id пользователя для логов -->
    <Printer>ivc22_1_1</Printer>  <!-- имя принтера, (см. Список доступных принтеров) -->
    <!-- должен быть указан QR или GTIN + Serial -->
    <QR>0104660068212768210fdaC6MeDQEMz992ffd0929ymi3p633GKY5Vv1T6olD8LdVe0g+jSquYWSP4bDZU53OIkf8Mqbnhu1guGXz8FN6IRrsWThu/DOGdoQ5D6DcA==</QR>
    <GTIN>8051931113460</GTIN> <!-- cod_good = 1001334230 -->
    <Serial>zmYkTASVrhisi</Serial>
    <!-- Необязательные, возвращаются Оракловым сервисом вместе с GTIN'ом -->
    <CodGood>1000005486</CodGood>
    <Country>USSR</Country>
    <Name>VALENOK</Name>
    <Size>XXXL</Size>
    <Brand>KOSMOS</Brand>
    <Model>Lesnik</Model>
</PocketPrintMarkHonest>*/
