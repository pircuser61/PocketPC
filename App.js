import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {rootReducer} from './redux/reducer';
import MainStackNav from './navigation/MainStackNav';
import {Provider} from 'react-redux';
import DataWedgeIntents from 'react-native-datawedge-intents';
import {DeviceEventEmitter} from 'react-native';
import {sendCommand} from './constants/funcrions';
import SplashScreen from 'react-native-splash-screen';
import {Provider as PaperProvider} from 'react-native-paper';

const Stack = createNativeStackNavigator();
const store = createStore(rootReducer, applyMiddleware(thunk));

const App = () => {
  const [dataWedgeVersion, setDataWedegeVersion] = useState(false);
  const [profile, setProfile] = useState('Пусто');

  const registerBroadcastReceiver = () => {
    DataWedgeIntents.registerBroadcastReceiver({
      filterActions: [
        'com.zebra.PocketPC.ACTION',
        'com.symbol.datawedge.api.RESULT_ACTION',
      ],
      filterCategories: ['android.intent.category.DEFAULT'],
    });
  };

  const broadcastReceiver = intent => {
    try {
      if (
        intent.hasOwnProperty(
          'com.symbol.datawedge.api.RESULT_GET_VERSION_INFO',
        )
      ) {
        let versionInfo =
          intent['com.symbol.datawedge.api.RESULT_GET_VERSION_INFO'];
        let datawedgeVersion = versionInfo['DATAWEDGE'];
        setDataWedegeVersion(datawedgeVersion);
        if (datawedgeVersion >= '6.3') datawedge63();
        if (datawedgeVersion >= '6.4') datawedge64();
        if (datawedgeVersion >= '6.5') datawedge65();
      } else if (
        intent.hasOwnProperty(
          'com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE',
        )
      ) {
        // Узнаем активный профиль приложения
        setProfile(
          intent['com.symbol.datawedge.api.RESULT_GET_ACTIVE_PROFILE'],
        );
      }
    } catch (e) {
      console.log(e);
    }
  };

  // Функция determineVersion определяет версию DataWedge установленного на устройстве
  const determineVersion = () => {
    sendCommand('com.symbol.datawedge.api.GET_VERSION_INFO', '');
  };
  //

  const datawedge63 = () => {
    sendCommand('com.symbol.datawedge.api.CREATE_PROFILE', 'PocketPC');
    sendCommand('com.symbol.datawedge.api.GET_ACTIVE_PROFILE', '');
  };
  //

  const datawedge64 = () => {
    let profileConfig = {
      PROFILE_NAME: 'PocketPC',
      PROFILE_ENABLED: 'true',
      CONFIG_MODE: 'UPDATE',
      PLUGIN_CONFIG: {
        PLUGIN_NAME: 'BARCODE',
        RESET_CONFIG: 'true',
        PARAM_LIST: {},
      },
      APP_LIST: [
        {
          PACKAGE_NAME: 'com.pocketpc',
          ACTIVITY_LIST: ['*'],
        },
      ],
    };
    sendCommand('com.symbol.datawedge.api.SET_CONFIG', profileConfig);

    //  Configure the created profile (intent plugin)
    let profileConfig2 = {
      PROFILE_NAME: 'PocketPC',
      PROFILE_ENABLED: 'true',
      CONFIG_MODE: 'UPDATE',
      PLUGIN_CONFIG: {
        PLUGIN_NAME: 'INTENT',
        RESET_CONFIG: 'true',
        PARAM_LIST: {
          intent_output_enabled: 'true',
          intent_action: 'com.zebra.PocketPC.ACTION',
          intent_delivery: '2',
          keystroke_output_enabled: '"false"',
        },
      },
    };

    let profileConfig3 = {
      PROFILE_NAME: 'PocketPC',
      PROFILE_ENABLED: 'true',
      CONFIG_MODE: 'UPDATE',
      PLUGIN_CONFIG: {
        PLUGIN_NAME: 'KEYSTROKE',
        RESET_CONFIG: 'true',
        PARAM_LIST: {
          intent_output_enabled: 'true',
          intent_action: 'com.zebra.PocketPC.ACTION',
          intent_delivery: '2',
          keystroke_output_enabled: '"false"',
        },
      },
    };
    sendCommand('com.symbol.datawedge.api.SET_CONFIG', profileConfig2);
    sendCommand('com.symbol.datawedge.api.SET_CONFIG', profileConfig3);

    //  Give some time for the profile to settle then query its value
    setTimeout(() => {
      sendCommand('com.symbol.datawedge.api.GET_ACTIVE_PROFILE', '');
    }, 1000);
  };

  const datawedge65 = () => {
    console.log('Datawedge 6.5 APIs are available');
  };

  useEffect(() => {
    SplashScreen.hide();
    let deviceEmitterSubscription = DeviceEventEmitter.addListener(
      'datawedge_broadcast_intent',
      intent => {
        broadcastReceiver(intent);
      },
    );
    registerBroadcastReceiver();
    determineVersion();
    // returned function will be called on component unmount
    return () => {
      deviceEmitterSubscription.remove();
    };
  }, []);

  return (
    <PaperProvider>
      <Provider store={store}>
        <MainStackNav />
      </Provider>
    </PaperProvider>
  );
};

export default App;
