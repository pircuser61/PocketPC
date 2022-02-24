import SoapRequest from 'react-native-soap-request';
import {DOMParser, XMLSerializer} from 'xmldom';
import {parseString} from 'react-native-xml2js';
//import {fetch} from 'react-native-ssl-pinning'
const xmlHeader = '<?xml version="1.0" encoding="utf-8"?>';

SoapRequest.prototype.InitParams = function (props) {
  if (props.security) {
    if (props.security.username && props.security.password)
      this.security = props.security;
    else console.error('missing security username and/or password');
  }

  if (props.targetNamespace) {
    this.targetNamespace = props.targetNamespace;
  }

  if (props.targetPrefix) {
    this.targetPrefix = props.targetPrefix;
  }

  if (props.commonTypes) {
    this.commonTypes = props.commonTypes;
  }

  if (props.requestURL) {
    this.requestURL = props.requestURL;
  }

  if (props.SoapAction || props.SoapAction === '') {
    this.SoapAction = props.SoapAction;
  }

  this.xmlRequest = null;
  this.xmlResponse = null;
  this.responseDoc = null;
};

SoapRequest.prototype.createRequest = function (request) {
  this.xmlDoc = new DOMParser().parseFromString(
    '<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"></soap:Envelope>',
  );
  this.rootElement = this.xmlDoc.documentElement;

  if (this.targetNamespace && this.targetPrefix) {
    this.rootElement.setAttribute(
      'xmlns:' + this.targetPrefix,
      this.targetNamespace,
    );
  }

  if (this.commonTypes) {
    this.rootElement.setAttribute('xmlns:ch1', this.commonTypes);
    this.rootElement.setAttribute('xmlns:cmn', this.commonTypes);
  }

  this.generateHeader();

  // Build request body
  const bodyElement = this.appendChild(this.rootElement, 'soap:Body');

  this.eachRecursive(request, bodyElement);

  //-------------------

  const xmlSerializer = new XMLSerializer();
  const xmlOutput = xmlSerializer.serializeToString(this.xmlDoc);
  this.xmlRequest = xmlHeader + xmlOutput;
  return this.xmlRequest;
};

SoapRequest.prototype.sendRequest = async function () {
  if (!this.xmlRequest) throw new Error('Пустое тело запроса!');
  if (!this.requestURL) throw new Error('Не указан endpoint!');
  if (!this.timeout) {
    this.timeout = 25000;
  }
  try {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), this.timeout);
    let response = await fetch(this.requestURL, {
      signal: controller.signal,
      method: 'POST',
      headers: {
        Accept: 'text/xml',
        'Content-Type': 'text/xml;charset=UTF-8',
        SOAPAction: this.SoapAction,
      },
      body: this.xmlRequest,
      /*sslPinning: {
            certs: ["rootCA","serverCA","webServerCA256"] // your certificates name (without extension), for example cert1.cer, cert2.cer
          }*/
    });
    clearTimeout(id);

    this.xmlResponse = await response.text();
    parseString(this.xmlResponse, (err, result) => {
      if (err) {
        throw err;
      }
      this.responseDoc = result;
    });
    return this.responseDoc;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw 'Превышено время ожидания запроса';
    }
    console.log('Ошибка запроса:  ' + error);
  }
};

export default SoapRequest;
