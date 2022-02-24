import {autorun, makeAutoObservable} from 'mobx';
import {configure} from 'mobx';
import {alertActions} from '../constants/funcrions';
import {PocketProvList} from '../functions/PocketProvList';
import {PalletInListCheck, ProverkaHeaderTitle} from '../types/types';
import UserStore from './UserStore';

configure({
  enforceActions: 'never',
});

class CheckPalletsStore {
  constructor() {
    makeAutoObservable(this);
  }
  curretElement: PalletInListCheck | null = null;
  loading_list = true;
  modal_filter_visible = false;
  list_of_elements: PalletInListCheck[] = [];
  list_of_elementsOptimize: PalletInListCheck[] = [];

  counter = 0;
  filtershop = '';
  error_string = '';
  Type = '';
  Title: ProverkaHeaderTitle = {
    firstScreen: '',
    secondScreen: '',
    thirdScreen: '',
    fourScreen: '',
  };

  async get_list_of_items(podrazd_code = '') {
    try {
      this.error_string = '';
      this.loading_list = true;
      if (this.filtershop.length <= 0) {
        this.filtershop = podrazd_code;
      }
      const answer: [] = await PocketProvList({
        Type: this.Type,
        City: UserStore.user?.['city.cod'],
        FilterShop: podrazd_code,
        UID: UserStore.user?.UserUID,
      });
      this.list_of_elements = answer;
      this.list_of_elementsOptimize = answer;

      this.filtershop = podrazd_code;
      return answer;
    } catch (e) {
      this.error_string = e + '';
    } finally {
      this.loading_list = false;
    }
  }

  resetStore = () => {
    console.log('Чистка стора CheckPalletsStore');
    this.loading_list = true;
    this.modal_filter_visible = false;
    this.list_of_elements = [];
    this.filtershop = '';
    this.error_string = '';
    this.curretElement = null;
    this.Type = '';
    this.Title = {
      firstScreen: '',
      secondScreen: '',
      thirdScreen: '',
      fourScreen: '',
    };
  };
}

export default new CheckPalletsStore();
