import {autorun, makeAutoObservable} from 'mobx';
import {configure} from 'mobx';
import {alertActions} from '../constants/funcrions';
import {PocketProvList} from '../functions/PocketProvList';
import {PalletInListCheck, ProverkaHeaderTitle} from '../types/types';
import UserStore from './UserStore';

configure({
  enforceActions: 'never',
});

class ProverkaNakladnyhStore {
  constructor() {
    makeAutoObservable(this);
  }

  Type: '' | '0' | '1' = '';

  resetStore = () => {
    console.log('Чистка стора ProverkaNakladnyhStore');

    this.Type = '';
  };
}

export default new ProverkaNakladnyhStore();
