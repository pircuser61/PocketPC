import React, {Component, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  AppRegistry,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated,
  useWindowDimensions,
  DeviceEventEmitter,
  Vibration,
} from 'react-native';
import DataWedgeIntents from 'react-native-datawedge-intents';
import {PocketListPrinters} from '../functions/PocketListPrinters';

import {} from '../redux/reducer';
import {Button} from 'react-native-paper';
import CodeMark from '../components/PechatKM/CodeMark';
import GoodInfo from '../components/PechatKM/GoodInfo';
import Header from '../components/PechatKM/Header';
import ScanCard from '../components/PechatKM/ScanCard';
import SendToPrint from '../components/PechatKM/SendToPrint';
import Snack from '../components/PechatKM/SnackBar';
import {toUTF8Array} from '../functions/checkTypes';
import {connect} from 'react-redux';
import ScanApi from '../customHooks/scannerApi';
import {TOGGLE_SCANNING} from '../constants/funcrions';

const ScannerScreen = ({user, navigation}) => {
  const [dataWedgeVersion, setDataWedegeVersion] = useState(false);
  const [profile, setProfile] = useState('Пусто');
  const [error, setError] = useState(false);
  const [visible, setVisible] = React.useState(false);

  let mounted = true;

  const [printer, setPrinter] = useState({printer: false, time: false});
  const showError = (color, text, fontColor) => {
    Vibration.vibrate(300);
    setError({color, text, fontColor});
    setVisible(true);
  };

  const moveAnim = useRef(new Animated.Value(220)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const fadeSendButtonAnim = useRef(new Animated.Value(0)).current;
  const fadeIn = (time = 300, value = 0) => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(fadeSendButtonAnim, {
      toValue: value,
      duration: time,
      useNativeDriver: true,
    }).start(({finished}) => {});
  };

  const registerBroadcastReceiver = () => {
    DataWedgeIntents.registerBroadcastReceiver({
      filterActions: [
        'com.zebra.PocketPC.ACTION',
        'com.symbol.datawedge.api.RESULT_ACTION',
      ],
      filterCategories: ['android.intent.category.DEFAULT'],
    });
  };

  const barcodeScanned = scanData => {
    let scannedData = scanData['com.symbol.datawedge.data_string'];
    let scannedType = scanData['com.symbol.datawedge.label_type'];
    let current = new Date();
    console.log(scannedData);
    api.setMiddleScan({scan: scannedData, time: current.toLocaleTimeString()});
  };

  const broadcastReceiver = intent => {
    try {
      console.log('Получено намерение: ' + JSON.stringify(intent));
      if (!intent.hasOwnProperty('RESULT_INFO')) {
        // Результат сканирования баркода
        barcodeScanned(intent);
      }
    } catch (e) {
      console.log(e);
    }
  };
  //

  // useEffect появляющийся первый раз для инициализации сканера
  useEffect(() => {
    let deviceEmitterSubscription = DeviceEventEmitter.addListener(
      'datawedge_broadcast_intent',
      intent => {
        broadcastReceiver(intent);
      },
    );
    registerBroadcastReceiver();
    //determineVersion();
    // returned function will be called on component unmount
    return () => {
      let current = new Date();
      setPrinter({printer: false, time: current.toLocaleTimeString()});
      api.setMiddleScan({scan: '', time: current.toLocaleTimeString()});
      mounted = false;
      deviceEmitterSubscription.remove();
    };
  }, []);

  useEffect(() => {
    !printer.printer
      ? PocketListPrinters(user['deviceName'], user.user.$['city.cod'])
          .then(r => {
            let current = new Date();
            mounted && setPrinter({printer: r[0]['Name'][0], time: current});
          })
          .catch(e => {
            showError('red', e, 'white');
          })
      : null;
  }, [printer]);

  const _slideYandFadeAnimation = (y, opacity, duration) => {
    Animated.parallel([
      Animated.spring(moveAnim, {
        useNativeDriver: true,
        velocity: 20,
        tension: 20,
        friction: 2000,
        toValue: y,
      }),
      Animated.timing(fadeAnim, {
        toValue: opacity,
        duration: duration,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const api = ScanApi({
    showError: (color, err, text) => showError(color, err, text),
    City: user.user.$['city.cod'],
  });
  useEffect(() => {
    api.barcodeInfo.CodGood.length === 0
      ? _slideYandFadeAnimation(220, 0, 300)
      : _slideYandFadeAnimation(80, 1, 300);
  }, [api.barcodeInfo]);

  useEffect(() => {
    api.GtinAndSerial.gtin.length > 0 ? fadeIn(300, 1) : fadeIn(300, 0);
  }, [api.GtinAndSerial]);

  return (
    <View style={styles.container}>
      <Header
        printer={printer.printer}
        user={user}
        navigation={navigation}
        reload={() => {
          let current = new Date();
          setPrinter({printer: false, time: current.toLocaleTimeString()});
          api.setMiddleScan({scan: '', time: current.toLocaleTimeString()});
        }}
      />
      <Animated.View
        style={[styles.scancard, {transform: [{translateY: moveAnim}]}]}>
        <ScanCard
          TOGGLE_SCANNING={TOGGLE_SCANNING}
          scannedData={api.scannedData.data}
          barcodeInfo={api.barcodeInfo}
        />
        <Animated.View
          style={[
            styles.box,
            {
              opacity: fadeAnim, // Bind opacity to animated value
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
            },
          ]}>
          <GoodInfo barcodeInfo={api.barcodeInfo} />
          <CodeMark api={api} TOGGLE_SCANNING={TOGGLE_SCANNING} />
          <Animated.View
            style={[
              {width: '100%'},
              {
                opacity: fadeSendButtonAnim, // Bind opacity to animated value
              },
            ]}>
            <SendToPrint
              api={api}
              printer={printer.printer}
              user={user}
              showError={(color, text, fontColor) =>
                showError(color, text, fontColor)
              }
            />
          </Animated.View>
        </Animated.View>
      </Animated.View>
      <Snack
        setVisible={r => setVisible(r)}
        visible={visible}
        error={error}
        setError={r => {
          setError(r);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //backgroundColor:'white'
  },
  scancard: {
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    top: 0,
    marginHorizontal: 20,
  },
});

const mapStateToProps = state => {
  return {
    appready: state.appready,
    user: state.user,
  };
};

export default connect(mapStateToProps, {})(ScannerScreen);

/*<Button onPress={()=>{
            setMiddleScan({scannedData:'010468041802580021v!GSPkqeeNLwT91006492m1oQsQsu3OUkzLXGCdjgFzHk3pLLKbnGSb41IHZFVFH39frWJx1ibWXIjrMWfPs5DKjJ3OZCzwkvJhz9Ik8TUw=='})
        }}>setMiddleScan+</Button>
        <Button onPress={()=>{
            setMiddleScan({scannedData:'4610019401406'})
        }}>setMiddleScan+</Button> */
