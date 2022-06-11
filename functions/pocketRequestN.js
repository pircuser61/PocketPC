import X2JS from 'x2js';
import UserStore from '../mobx/UserStore';
import {DOMParser, XMLSerializer} from 'xmldom';
import {uri} from '../connectInfo';
import {parseString} from 'react-native-xml2js';

const request = async (wsName, body, responseParserConfig) => {
  const City = UserStore.user?.['city.cod'];
  const xml = getSoapXml(City, wsName, body);
  const response_raw = await requestGestori(City, xml);
  return parseResponse(wsName, response_raw, responseParserConfig);
};

export const requestGS = async (wsName, body, responseParserConfig) => {
  const City = UserStore.user?.['city.cod'];
  let xml = getSoapXml(City, wsName, body);
  xml = xml.replaceAll('\u001D', '&amp;#x001d;');
  const response_raw = await requestGestori(City, xml);
  return parseResponse(wsName, response_raw, responseParserConfig);
};

const appendNode = (xmlDoc, parent, name, text) => {
  const child = xmlDoc.createElement(name);
  parent.appendChild(child);
  if (typeof text !== 'undefined') {
    const textNode = xmlDoc.createTextNode(text);
    child.appendChild(textNode);
  }
  return child;
};

const appendJSON = (xmlDoc, parent, val) => {
  /*
  x:"a" -> <x>a</x>
  x:{y:{"a"}} -> <x> <y>a</y> </x>
  x:{y:{"a"},z:{"b"}} -> <x> <y>a</y> <z>b</z> </x>
  
  x:y[] -> <x></x>
  x:y["a"] <x> <y>a</y> </x>
  x:y["a", "b"] <x> <y>a</y> <y>b</y> </x>
  */
  for (var key in val) {
    item = val[key];
    switch (typeof item) {
      case 'undefined':
        const child = xmlDoc.createElement(key);
        parent.appendChild(child);
        break;
      case 'object': {
        if (item instanceof Array) {
          for (x of item) {
            const child = xmlDoc.createElement(key);
            parent.appendChild(child);
            appendJSON(xmlDoc, child, x);
          }
        } else {
          const child = xmlDoc.createElement(key);
          parent.appendChild(child);
          appendJSON(xmlDoc, child, item);
        }
        break;
      }

      default: {
        //  string, number, boolean
        const child = xmlDoc.createElement(key);
        parent.appendChild(child);
        const textNode = xmlDoc.createTextNode(item);
        child.appendChild(textNode);
      }
    }
  }
};

const getSoapXml = (City, wsName, request) => {
  const setAttr = (xmlDoc, node, key, val) => {
    const attr = xmlDoc.createAttribute(key);
    attr.value = val;
    node.setAttributeNode(attr);
  };

  request = {
    City,
    UID: UserStore.user?.UserUID,
    ...request,
  };
  const docReq = new DOMParser().parseFromString(`<${wsName}/>`);
  const wsRoot = docReq.documentElement;

  appendJSON(docReq, wsRoot, request);

  const xmlSerializer = new XMLSerializer();
  const xmlReq = xmlSerializer.serializeToString(docReq);

  console.log('\x1b[33m', 'JSON REQUEST V2');
  console.log('\x1b[33m', request);
  console.log('\x1b[32m', 'XML REQUEST V2');
  console.log('\x1b[32m', xmlReq);

  // SOAP ENVELOPE
  const docSoap = new DOMParser().parseFromString(
    '<?xml version="1.0" encoding="utf-8"?>' +
      '<soap:Envelope' +
      ' xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"' +
      ' xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"' +
      ' xmlns:xsd="http://www.w3.org/2001/XMLSchema"' +
      ' xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"' +
      ' xmlns:urn="urn:gestori-gate:ws_gate">' +
      '</soap:Envelope>',
  );
  const root = docSoap.documentElement;
  appendNode(docSoap, root, 'soapenv:Header');
  const body = appendNode(docSoap, root, 'soapenv:Body');
  const urn = appendNode(docSoap, body, 'urn:ws_gate');
  const urnAttr = docSoap.createAttribute('soapenv:encodingStyle');
  urnAttr.value = 'http://schemas.xmlsoap.org/soap/encoding/';
  urn.setAttributeNode(urnAttr);
  const gate = appendNode(docSoap, urn, 'gate2prog', wsName);
  setAttr(docSoap, gate, 'xsi:type', 'xsd:string');
  const param = appendNode(docSoap, urn, 'param4prog', xmlReq);
  setAttr(docSoap, param, 'xsi:type', 'xsd:string');
  const db = appendNode(docSoap, urn, 'wantDbTo', 'ges-local');
  setAttr(docSoap, db, 'xsi:type', 'xsd:string');
  return xmlSerializer.serializeToString(docSoap);
};

const requestGestori = async (City, xmlSoap) => {
  const controller = new AbortController();
  const id = setTimeout(controller.abort, 25000);
  const requestURL = uri + '/ws_gate' + City + '/ws_gate';
  const response = await fetch(requestURL, {
    signal: controller.signal,
    method: 'POST',
    headers: {
      Accept: 'text/xml',
      'Content-Type': 'text/xml;charset=UTF-8',
      SOAPAction: '""',
    },
    body: xmlSoap,
  });
  clearTimeout(id);
  xmlResponse = await response.text();
  parseString(xmlResponse, (err, result) => {
    if (err) throw err;
    responseDoc = result;
  });
  return responseDoc;
};

const parseResponse = (wsName, response_raw, responseParserConfig) => {
  if (!response_raw) throw 'Ответ от сервера не пришел!';
  if (response_raw['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0]['SOAP-ENV:Fault']) {
    let faultmsg;
    try {
      const fault =
        response_raw['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
          'SOAP-ENV:Fault'
        ][0];
      // console.log('\x1b[31m', fault.faultcode[0]);
      // console.log('\x1b[31m', fault.faultstring[0]);

      const description =
        fault.detail[0]['ns1:FaultDetail'][0]['errorMessage'][0];
      //  console.log('\x1b[31m', description);
      faultmsg = 'Ошибка ответа "SOAP-ENV:Fault\n"' + description;
    } catch {
      faultmsg = 'Ошибка ответа "SOAP-ENV:Fault"';
    }
    throw faultmsg;
  }
  const response_xml =
    response_raw['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0][
      'ns1:ws_gateResponse'
    ][0]['xmlOut'][0]['_'];

  if (!response_xml) throw 'Получен пустой ответ. (нет xmlOut)';

  console.log('\x1b[35m', 'RESPONSE XML:');
  console.log('\x1b[35m', response_xml);

  const x2js = new X2JS(responseParserConfig);
  let response_json;
  try {
    response_json = x2js.xml2js(response_xml);
  } catch (error) {
    throw 'Ошибка извлечения тела ответа [1].';
  }
  if (!response_json) throw 'Ошибка извлечения тела ответа [2].';

  console.log('\x1b[36m', 'JSON RESPONSE');
  console.log('\x1b[36m', response_json);

  for (let key in response_json) {
    if (key === 'ReturnResponse') {
      let isErr = true;
      let errText = '';
      for (let x1 in response_json[key]) {
        if (x1 == '_Error') {
          isErr = response_json[key][x1] != 'False';
        } else if (x1 == 'ReturnMessage') {
          errText = response_json[key][x1];
        }
      }
      if (isErr)
        if (errText && errText.length > 0)
          // Допустим есть сервисы для которых ReturnResponse это норма
          throw errText;
        else 'Ошибка уровния прослойки.';
    }
    if (key === wsName) {
      const err = response_json[key]._Error;
      if (err === undefined) throw 'Сервис не вернул признак ошибки.';
      if (err.toLocaleLowerCase() != 'false') {
        const err_text = response_json[key].Error;
        if (err_text && err_text.length > 0) throw err_text;
        throw 'Сервис вернул пустую ошибку.';
      }
    } else throw 'Ожидался корневой элемент ' + wsName + ' получен ' + key;
  }

  return response_json[wsName];
};

export default request;
