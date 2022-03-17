import AsyncStorage from '@react-native-async-storage/async-storage';
import {autorun, makeAutoObservable, when} from 'mobx';
import {configure} from 'mobx';
import {Image} from 'react-native';
import React, {FC, useEffect, useCallback, useState} from 'react';
import {changeToCastorama, changeToMaxidom} from '../connectInfo';

configure({
  enforceActions: 'never',
});

class ShopStore {
  constructor() {
    makeAutoObservable(this);
    when(() => {
      //console.log(this.changeLocation);
    });
  }

  shopName = '';
  isReady = false;

  deleteShop = async () => {
    try {
      this.shopName = '';
      await AsyncStorage.removeItem('city');
      await AsyncStorage.removeItem('shopname');
    } catch (error) {}
  };

  LogImage = () => {
    switch (this.shopName) {
      case 'maxidom':
        return (
          <Image
            source={require('../assets/logo.png')}
            style={{
              height: 80,
              width: 120,
            }}
          />
        );
      case 'castorama':
        return (
          <Image
            source={require('../assets/castalogo.png')}
            style={{
              height: 40,
              width: 240,
              marginVertical: 20,
            }}
          />
        );

      default:
        return (
          <Image
            source={require('../assets/logo.png')}
            style={{
              height: 80,
              width: 120,
              alignSelf: 'center',
            }}
          />
        );
    }
  };

  getShopFromAsync = async () => {
    try {
      const value = await AsyncStorage.getItem('shopname');
      if (value !== null) {
        switch (value) {
          case 'maxidom':
            changeToMaxidom();
            this.shopName = value;
            break;
          case 'castorama':
            changeToCastorama();
            this.shopName = value;
            break;

          default:
            this.shopName = '';
            break;
        }

        console.log(value);
      }
    } catch (e) {
    } finally {
      this.isReady = true;
    }
  };

  chooseShop = async (chosenCity = '') => {
    try {
      switch (chosenCity) {
        case 'maxidom':
          changeToMaxidom();
          this.shopName = chosenCity;
          break;
        case 'castorama':
          changeToCastorama();
          this.shopName = chosenCity;
          break;

        default:
          this.shopName = '';
          break;
      }
      await AsyncStorage.setItem('shopname', chosenCity);
    } catch (e) {
      console.log(e);
    }
  };

  resetStore = () => {};
}

export default ShopStore = new ShopStore();
