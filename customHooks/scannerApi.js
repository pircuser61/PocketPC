import React, {Component, useEffect, useRef, useState} from 'react';
import {checkGtin} from '../functions/checkGtin';
import {toUTF8Array} from '../functions/checkTypes';
import {PocketBarcodInfo} from '../functions/PocketBarcodInfo';

const ScanApi = ({showError, City}) => {
  let mounted = true;

  const [middleScan, setMiddleScan] = useState({scan: '', time: ''});
  const [scannedData, setScannedData] = useState({data: '', time: ''});
  const [signal, setSignal] = useState(false);
  const [barcodeInfo, setBarcodeInfo] = useState({
    CodGood: '',
    Name: '',
    barcode: '',
  });
  const [gtinsList, addGtins] = useState([]);
  const [GtinAndSerial, setGtinAndSerial] = useState({
    gtin: '',
    qr: '',
    serial: '',
    gtinInfo: {
      country: [{_: ''}],
      name: [{_: ''}],
      productsize: [{_: ''}],
      brand: [{_: ''}],
      model: [{_: ''}],
    },
  });

  // const clearField=(x)=>{
  //   if(scannedData.data===''&&barcodeInfo)
  // }

  useEffect(() => {
    console.log(
      JSON.stringify(middleScan) +
        '\n' +
        JSON.stringify(scannedData) +
        '\n' +
        JSON.stringify(barcodeInfo) +
        '\n' +
        '\n',
    );
  });

  useEffect(() => {
    gtinsList.length > 0 ? console.log('Список гтинов' + gtinsList) : null;
  }, [gtinsList]);

  useEffect(() => {
    barcodeInfo.CodGood.length > 0
      ? checkGtin(barcodeInfo.CodGood)
          .then(r => {
            mounted && addGtins(r);
          })
          .catch(e => showError('red', 'Ошибка оракла: ' + e, 'white'))
      : null;

    if (barcodeInfo.CodGood.length === 0) {
      addGtins([]);
      setGtinAndSerial({
        gtin: '',
        serial: '',
        qr: '',
        gtinInfo: {
          country: [{_: ''}],
          name: [{_: ''}],
          productsize: [{_: ''}],
          brand: [{_: ''}],
          model: [{_: ''}],
        },
      });
    }

    return () => {
      mounted = false;
    };
  }, [barcodeInfo]);

  const loadBarcodeInfo = async () => {
    setTimeout(() => {
      mounted && console.log('Сработал');
      mounted &&
        PocketBarcodInfo(scannedData.data, City)
          .then(r => {
            mounted &&
              setBarcodeInfo({
                CodGood: r.CodGood[0],
                Name: r.Name[0],
                barcode: r.barcode[0],
              });
          })
          .catch(e => showError('red', e, 'white'));
    }, 300);
  };

  useEffect(() => {
    return () => {
      mounted = false;
    };
  }, [signal]);

  useEffect(() => {
    setBarcodeInfo({CodGood: '', Name: '', barcode: ''});
    console.log('scannedData' + JSON.stringify(scannedData));
    if (scannedData.data.length === 0) {
      setBarcodeInfo({CodGood: '', Name: '', barcode: ''});
    }
    if (scannedData.data.length) {
      loadBarcodeInfo();
    }

    return () => {
      mounted = false;
    };
  }, [scannedData]);

  useEffect(() => {
    let current = new Date();
    console.log('middleScan: ' + JSON.stringify(middleScan));
    if (middleScan?.scan?.length) {
      if (
        middleScan.scan.slice(0, 2) === '01' &&
        middleScan.scan.slice(16, 18) === '21' &&
        toUTF8Array(middleScan.scan[31]) == 29
      ) {
        if (gtinsList.length > 0 && barcodeInfo.CodGood.length > 0) {
          let isHere = 0;
          gtinsList.map(r => {
            if (middleScan?.scan.includes(r['gtin'][0])) {
              isHere++;
              setGtinAndSerial({
                gtin: r['gtin'][0],
                serial: middleScan.scan.slice(18, 31),
                gtinInfo: r,
                qr: middleScan.scan,
              });
            }
          });
          if (!isHere) {
            showError(
              'red',
              'Код маркировки не принадлежит данному товару!',
              'white',
            );
          }
        } else {
          if (barcodeInfo.CodGood.length > 0)
            showError('#e8d05a', 'Идет загрузка!', 'black');
          else showError('#e8d05a', 'Сначала сканируйте баркод!', 'black');
        }
      } else {
        setScannedData({
          data: middleScan.scan,
          time: current.toLocaleTimeString(),
        });
      }
    } else {
      setScannedData({data: '', time: current.toLocaleTimeString()});
    }
    return () => {
      mounted = false;
    };
  }, [middleScan]);

  return {
    middleScan,
    setMiddleScan,
    signal,
    setSignal,
    barcodeInfo,
    scannedData,
    gtinsList,
    GtinAndSerial,
  };
};

export default ScanApi;
